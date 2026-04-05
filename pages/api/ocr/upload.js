import connectDB from '../../../lib/mongodb';
import OCRScan from '../../../models/OCRScan';
import { verifyRequestAuth } from '../../../middleware/auth';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

// Disable default body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  await connectDB();

  // Verify authentication
  const authResult = await verifyRequestAuth(req);
  if (!authResult.success) {
    return res.status(401).json({ success: false, message: authResult.message });
  }

  const userId = authResult.user.id;

  try {
    // Parse form data
    const form = formidable({
      uploadDir: './public/uploads/receipts',
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB limit
      filter: ({ mimetype }) => {
        // Allow images and PDFs
        return mimetype && (
          mimetype.includes('image/') || 
          mimetype.includes('application/pdf')
        );
      }
    });

    // Ensure upload directory exists
    const uploadDir = './public/uploads/receipts';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const [fields, files] = await form.parse(req);
    
    const file = Array.isArray(files.receipt) ? files.receipt[0] : files.receipt;
    
    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const ext = path.extname(file.originalFilename || '');
    const filename = `receipt_${userId}_${timestamp}${ext}`;
    const newPath = path.join(uploadDir, filename);

    // Move file to permanent location
    fs.renameSync(file.filepath, newPath);

    // Create OCR scan record
    const ocrScan = new OCRScan({
      userId,
      originalFile: {
        filename,
        originalName: file.originalFilename || 'unknown',
        mimetype: file.mimetype || 'application/octet-stream',
        size: file.size || 0,
        url: `/uploads/receipts/${filename}`
      },
      status: 'pending'
    });

    await ocrScan.save();

    // TODO: Queue OCR processing job here
    // For now, we'll simulate processing
    setTimeout(async () => {
      try {
        // Simulate OCR processing
        await simulateOCRProcessing(ocrScan._id);
      } catch (error) {
        console.error('OCR processing error:', error);
      }
    }, 2000);

    res.status(201).json({
      success: true,
      message: 'File uploaded successfully',
      scanId: ocrScan._id,
      scan: ocrScan.getSummary()
    });

  } catch (error) {
    console.error('Upload error:', error);
    
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 10MB.'
      });
    }

    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Invalid file type. Only images and PDFs are allowed.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Upload failed'
    });
  }
}

// Simulate OCR processing (replace with actual OCR service)
async function simulateOCRProcessing(scanId) {
  try {
    const scan = await OCRScan.findById(scanId);
    if (!scan) return;

    // Update status to processing
    scan.status = 'processing';
    await scan.save();

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Simulate extracted data
    const mockExtractedData = {
      amount: {
        value: 25.99,
        confidence: 85,
        rawText: '$25.99'
      },
      merchant: {
        value: 'Sample Restaurant',
        confidence: 90,
        rawText: 'SAMPLE RESTAURANT'
      },
      date: {
        value: new Date(),
        confidence: 80,
        rawText: new Date().toLocaleDateString()
      },
      category: {
        value: 'Food & Dining',
        confidence: 75
      },
      currency: {
        value: 'USD',
        confidence: 95
      }
    };

    // Update scan with results
    scan.status = 'completed';
    scan.extractedData = mockExtractedData;
    scan.overallConfidence = 83;
    scan.processingTime = 3000;
    scan.rawText = 'SAMPLE RESTAURANT\n$25.99\n' + new Date().toLocaleDateString();

    await scan.save();

  } catch (error) {
    console.error('OCR simulation error:', error);
    
    // Mark as failed
    const scan = await OCRScan.findById(scanId);
    if (scan) {
      scan.status = 'failed';
      scan.error = {
        message: error.message,
        code: 'PROCESSING_ERROR'
      };
      await scan.save();
    }
  }
}