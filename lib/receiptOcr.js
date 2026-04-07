import fs from 'fs';
import path from 'path';

/**
 * Extract text from receipt image (Tesseract) or text-based PDF (pdf-parse).
 */
export async function runReceiptOcr({ absolutePath, mimetype }) {
  const mt = (mimetype || '').toLowerCase();
  let rawText = '';

  if (mt.includes('pdf')) {
    const buffer = fs.readFileSync(absolutePath);
    const pdfParse = (await import('pdf-parse')).default;
    const data = await pdfParse(buffer);
    rawText = (data.text || '').trim();
    if (!rawText || rawText.length < 8) {
      rawText =
        '[PDF contained little or no selectable text — scanned PDFs need an image export for best results.]\n' +
        rawText;
    }
  } else if (mt.startsWith('image/')) {
    const { createWorker } = await import('tesseract.js');
    const worker = await createWorker('eng');
    try {
      const {
        data: { text },
      } = await worker.recognize(absolutePath);
      rawText = (text || '').trim();
    } finally {
      await worker.terminate();
    }
  } else {
    throw new Error('Unsupported file type for OCR');
  }

  const parsed = parseReceiptText(rawText);
  return {
    rawText,
    extractedData: parsed.extractedData,
    overallConfidence: parsed.overallConfidence,
    ocrEngine: mt.includes('pdf') ? 'pdf-parse' : 'tesseract',
  };
}

function pickAmount(lines, fullText) {
  const totalPatterns = [
    /(?:total|balance\s*due|amount\s*due|grand\s*total|subtotal|amt\.?)\s*[:#]?\s*(?:PKR|Rs\.?|USD|\$|€|£)?\s*([\d,]+\.?\d*)/i,
    /(?:PKR|Rs\.?|USD|\$|€|£)\s*([\d,]+\.?\d{2})\b/i,
  ];
  for (const line of lines) {
    for (const re of totalPatterns) {
      const m = line.match(re);
      if (m) {
        const n = parseMoney(m[1]);
        if (n != null && n > 0 && n < 1e7) return { value: n, rawText: line };
      }
    }
  }
  const floatRe = /(?:PKR|Rs\.?|USD|\$|€|£)?\s*([\d]{1,3}(?:[,\s]\d{3})*(?:\.\d{2})|\d+\.\d{2})\b/g;
  let best = null;
  let bestRaw = '';
  let m;
  while ((m = floatRe.exec(fullText)) !== null) {
    const n = parseMoney(m[1]);
    if (n != null && n > 0 && n < 1e7) {
      if (best == null || n > best) {
        best = n;
        bestRaw = m[0];
      }
    }
  }
  if (best != null) return { value: best, rawText: bestRaw };
  return { value: null, rawText: '' };
}

function parseMoney(s) {
  if (!s) return null;
  const cleaned = s.replace(/[\s,]/g, '');
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? n : null;
}

function pickDate(lines, fullText) {
  const patterns = [
    /\b(\d{1,2}[/.-]\d{1,2}[/.-]\d{2,4})\b/,
    /\b(\d{4}[/.-]\d{1,2}[/.-]\d{1,2})\b/,
  ];
  for (const line of lines) {
    for (const re of patterns) {
      const m = line.match(re);
      if (m) {
        const d = tryParseDate(m[1]);
        if (d && !Number.isNaN(d.getTime())) return { value: d, rawText: m[1] };
      }
    }
  }
  for (const re of patterns) {
    const m = fullText.match(re);
    if (m) {
      const d = tryParseDate(m[1]);
      if (d && !Number.isNaN(d.getTime())) return { value: d, rawText: m[1] };
    }
  }
  return { value: new Date(), rawText: new Date().toISOString().slice(0, 10) };
}

function tryParseDate(str) {
  if (!str) return null;
  const normalized = str.replace(/\//g, '-').replace(/\./g, '-');
  const d = new Date(normalized);
  if (!Number.isNaN(d.getTime())) return d;
  const parts = str.split(/[/.-]/);
  if (parts.length === 3) {
    const a = parseInt(parts[0], 10);
    const b = parseInt(parts[1], 10);
    const c = parseInt(parts[2], 10);
    if (parts[0].length === 4) return new Date(c > 99 ? c : 2000 + c, b - 1, a);
    if (a > 12) return new Date(c > 99 ? c : 2000 + c, b - 1, a);
    return new Date(c > 99 ? c : 2000 + c, a - 1, b);
  }
  return null;
}

function pickMerchant(lines) {
  const skip = /^(receipt|invoice|tax|date|time|tel|phone|www\.|http|thank|cash|change|visa|mastercard|card)\b/i;
  for (const line of lines.slice(0, 12)) {
    if (line.length < 3 || line.length > 80) continue;
    if (/^\d+[\d\s.,$€£]*$/.test(line)) continue;
    if (skip.test(line)) continue;
    if (/[a-zA-Z]/.test(line)) return { value: line.slice(0, 100), rawText: line };
  }
  return { value: 'Unknown merchant', rawText: '' };
}

function guessCategory(text) {
  const t = text.toLowerCase();
  if (/(restaurant|cafe|coffee|pizza|food|dining|burger|kitchen)/i.test(t))
    return { value: 'Food & Dining', confidence: 55 };
  if (/(fuel|gas|petrol|shell|esso|bp\s|station)/i.test(t)) return { value: 'Transport', confidence: 50 };
  if (/(pharmacy|drug|medical|hospital|clinic)/i.test(t)) return { value: 'Health', confidence: 50 };
  if (/(grocery|supermarket|mart|walmart|target)/i.test(t)) return { value: 'Groceries', confidence: 50 };
  return { value: 'General expense', confidence: 35 };
}

export function parseReceiptText(rawText) {
  const lines = rawText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const fullText = lines.join('\n');
  const amount = pickAmount(lines, fullText);
  const date = pickDate(lines, fullText);
  const merchant = pickMerchant(lines);
  const cat = guessCategory(fullText);

  const currencyGuess = /\bPKR\b|Rs\.?/i.test(fullText)
    ? 'PKR'
    : /\$\d/.test(fullText)
      ? 'USD'
      : /€/.test(fullText)
        ? 'EUR'
        : 'USD';

  let score = 40;
  if (amount.value != null) score += 25;
  if (merchant.value && merchant.value !== 'Unknown merchant') score += 15;
  if (date.value) score += 10;
  score += Math.min(10, Math.floor(lines.length / 5));

  const extractedData = {
    amount: {
      value: amount.value ?? undefined,
      confidence: amount.value != null ? 72 : 20,
      rawText: amount.rawText || '',
    },
    merchant: {
      value: merchant.value,
      confidence: merchant.value !== 'Unknown merchant' ? 68 : 30,
      rawText: merchant.rawText || '',
    },
    date: {
      value: date.value,
      confidence: 65,
      rawText: date.rawText || '',
    },
    category: {
      value: cat.value,
      confidence: cat.confidence,
    },
    currency: {
      value: currencyGuess,
      confidence: 55,
    },
  };

  return {
    extractedData,
    overallConfidence: Math.min(95, Math.round(score)),
  };
}

export function resolveReceiptAbsolutePath(filename) {
  if (!filename || filename.includes('..')) return null;
  return path.join(process.cwd(), 'public', 'uploads', 'receipts', path.basename(filename));
}
