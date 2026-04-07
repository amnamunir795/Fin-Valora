import connectDB from '../../../../../lib/mongodb';
import OCRScan from '../../../../../models/OCRScan';
import Transaction from '../../../../../models/Transaction';
import Category from '../../../../../models/Category';
import Budget from '../../../../../models/Budget';
import { verifyRequestAuth } from '../../../../../middleware/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  await connectDB();

  const authResult = await verifyRequestAuth(req);
  if (!authResult.success) {
    return res.status(401).json({ success: false, message: authResult.message });
  }

  const userId = authResult.user.id;
  const { id } = req.query;
  const { categoryId, amount: amountOverride, description, merchant, date: dateOverride } = req.body || {};

  if (!categoryId) {
    return res.status(400).json({ success: false, message: 'categoryId is required' });
  }

  try {
    const scan = await OCRScan.findOne({ _id: id, userId });
    if (!scan) {
      return res.status(404).json({ success: false, message: 'Scan not found' });
    }

    if (scan.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'OCR must be completed before adding an expense',
      });
    }

    if (scan.transactionId) {
      return res.status(400).json({
        success: false,
        message: 'This receipt is already linked to a transaction',
      });
    }

    const category = await Category.findOne({
      _id: categoryId,
      userId,
      isActive: true,
      type: 'Expense',
    });

    if (!category) {
      return res.status(400).json({ success: false, message: 'Invalid expense category' });
    }

    const amt =
      amountOverride != null && amountOverride !== ''
        ? parseFloat(amountOverride)
        : scan.extractedData?.amount?.value;
    if (amt == null || Number.isNaN(amt) || amt <= 0) {
      return res.status(400).json({
        success: false,
        message: 'A valid amount is required (from OCR or manual entry)',
      });
    }

    const txDate = dateOverride
      ? new Date(dateOverride)
      : scan.extractedData?.date?.value
        ? new Date(scan.extractedData.date.value)
        : new Date();

    if (Number.isNaN(txDate.getTime())) {
      return res.status(400).json({ success: false, message: 'Invalid date' });
    }

    const desc =
      (description && String(description).trim()) ||
      `Receipt: ${scan.extractedData?.merchant?.value || scan.originalFile?.originalName || 'Purchase'}`;

    const merch =
      (merchant && String(merchant).trim()) ||
      (scan.extractedData?.merchant?.value || '').trim() ||
      '';

    const budget = await Budget.findOne({
      userId,
      budgetYear: txDate.getFullYear(),
      budgetMonth: txDate.getMonth() + 1,
      isActive: true,
    });

    if (!budget) {
      return res.status(400).json({
        success: false,
        message: 'No active budget found for this period',
      });
    }

    const transaction = new Transaction({
      userId,
      categoryId,
      budgetId: budget._id,
      amount: amt,
      description: desc.slice(0, 200),
      merchant: merch.slice(0, 100),
      type: 'Expense',
      date: txDate,
      currency: budget.currency || scan.extractedData?.currency?.value || 'USD',
      isFromOCR: true,
      notes: `From OCR scan ${scan._id}`,
    });

    await transaction.save();

    budget.currentSpent += amt;
    await budget.save();

    scan.transactionId = transaction._id;
    scan.isReviewed = true;
    scan.isApproved = true;
    await scan.save();

    await transaction.populate('categoryId', 'name type color');

    return res.status(201).json({
      success: true,
      message: 'Expense created from receipt',
      transaction: {
        ...transaction.getSummary(),
        category: transaction.categoryId,
      },
      scan: scan.getSummary(),
    });
  } catch (error) {
    console.error('apply-expense error:', error);
    return res.status(500).json({ success: false, message: 'Failed to create expense' });
  }
}
