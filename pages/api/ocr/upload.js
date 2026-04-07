import connectDB from '../../../lib/mongodb';
import OCRScan from '../../../models/OCRScan';
import { verifyRequestAuth } from '../../../middleware/auth';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { runReceiptOcr, resolveReceiptAbsolutePath } from '../../../lib/receiptOcr';

export const config = {
  api: {
    bodyParser: false,
    responseLimit: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({
      success: false,
      message: 'Method not allowed',
    });
  }

  await connectDB();

  const authResult = await verifyRequestAuth(req);
  if (!authResult.success) {
    return res.status(401).json({ success: false, message: authResult.message });
  }

  const userId = authResult.user.id;

  try {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'receipts');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const form = formidable({
      uploadDir,
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024,
      filter: ({ mimetype }) =>
        Boolean(
          mimetype &&
            (mimetype.includes('image/') ||
              mimetype.includes('application/pdf') ||
              mimetype === 'image/webp'),
        ),
    });

    const [fields, files] = await form.parse(req);

    const file = Array.isArray(files.receipt) ? files.receipt[0] : files.receipt;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    const timestamp = Date.now();
    const ext = path.extname(file.originalFilename || '') || '.bin';
    const filename = `receipt_${userId}_${timestamp}${ext}`;
    const newPath = path.join(uploadDir, filename);

    fs.renameSync(file.filepath, newPath);

    const ocrScan = new OCRScan({
      userId,
      originalFile: {
        filename,
        originalName: file.originalFilename || 'unknown',
        mimetype: file.mimetype || 'application/octet-stream',
        size: file.size || 0,
        url: `/uploads/receipts/${filename}`,
      },
      status: 'processing',
    });

    await ocrScan.save();

    const absPath = resolveReceiptAbsolutePath(filename);
    const started = Date.now();

    try {
      if (!absPath || !fs.existsSync(absPath)) {
        throw new Error('Saved file not found');
      }

      const result = await runReceiptOcr({
        absolutePath: absPath,
        mimetype: ocrScan.originalFile.mimetype,
      });

      ocrScan.status = 'completed';
      ocrScan.rawText = result.rawText;
      ocrScan.extractedData = result.extractedData;
      ocrScan.overallConfidence = result.overallConfidence;
      ocrScan.processingTime = Date.now() - started;
      ocrScan.ocrEngine = result.ocrEngine;
      ocrScan.error = undefined;
      await ocrScan.save();
    } catch (ocrError) {
      console.error('OCR processing error:', ocrError);
      ocrScan.status = 'failed';
      ocrScan.error = {
        message: ocrError.message || 'OCR failed',
        code: 'OCR_ERROR',
      };
      ocrScan.processingTime = Date.now() - started;
      await ocrScan.save();
    }

    return res.status(201).json({
      success: true,
      message:
        ocrScan.status === 'completed'
          ? 'Receipt processed successfully'
          : 'File uploaded but OCR failed — you can try another image or PDF with selectable text',
      scanId: ocrScan._id,
      scan: ocrScan.getSummary(),
    });
  } catch (error) {
    console.error('Upload error:', error);

    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 10MB.',
      });
    }

    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Invalid file type. Only images and PDFs are allowed.',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Upload failed',
    });
  }
}
