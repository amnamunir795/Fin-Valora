import connectDB from '../../../lib/mongodb';
import Transaction from '../../../models/Transaction';
import Category from '../../../models/Category';
import Budget from '../../../models/Budget';
import { verifyRequestAuth } from '../../../middleware/auth';

/** direction: 1 = apply transaction to ledger, -1 = reverse */
function applyLedgerToBudget(budget, type, amount, direction) {
  const signed = Number(amount) * direction;
  if (type === 'Expense') {
    budget.currentSpent = Math.max(0, (budget.currentSpent || 0) + signed);
  } else {
    budget.currentSaved = Math.max(0, (budget.currentSaved || 0) + signed);
  }
}

export default async function handler(req, res) {
  await connectDB();

  const authResult = await verifyRequestAuth(req);
  if (!authResult.success) {
    return res.status(401).json({ success: false, message: authResult.message });
  }

  const userId = authResult.user.id;
  const { id } = req.query;

  if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ success: false, message: 'Invalid transaction ID' });
  }

  const transaction = await Transaction.findOne({ _id: id, userId });
  if (!transaction) {
    return res.status(404).json({ success: false, message: 'Transaction not found' });
  }

  if (req.method === 'DELETE') {
    try {
      const budget = await Budget.findOne({
        _id: transaction.budgetId,
        userId,
        isActive: true,
      });
      if (budget) {
        applyLedgerToBudget(budget, transaction.type, transaction.amount, -1);
        await budget.save();
      }
      await Transaction.deleteOne({ _id: id, userId });
      return res.status(200).json({ success: true, message: 'Transaction deleted successfully' });
    } catch (error) {
      console.error('Error deleting transaction:', error);
      return res.status(500).json({ success: false, message: 'Failed to delete transaction' });
    }
  }

  if (req.method === 'PUT') {
    try {
      const {
        categoryId,
        amount,
        description,
        merchant,
        type,
        date,
        currency,
        tags,
        notes,
      } = req.body;

      if (!categoryId || amount == null || !description || !type || !date) {
        return res.status(400).json({
          success: false,
          message: 'Category, amount, description, type, and date are required',
        });
      }

      if (!['Income', 'Expense'].includes(type)) {
        return res.status(400).json({
          success: false,
          message: 'Type must be either Income or Expense',
        });
      }

      const category = await Category.findOne({
        _id: categoryId,
        userId,
        isActive: true,
      });
      if (!category) {
        return res.status(400).json({ success: false, message: 'Invalid category' });
      }
      if (category.type !== type) {
        return res.status(400).json({
          success: false,
          message: 'Category type does not match transaction type',
        });
      }

      const oldBudget = await Budget.findOne({
        _id: transaction.budgetId,
        userId,
      });
      if (!oldBudget) {
        return res.status(400).json({
          success: false,
          message: 'Original budget not found for this transaction',
        });
      }

      applyLedgerToBudget(oldBudget, transaction.type, transaction.amount, -1);

      const transactionDate = new Date(date);
      const targetBudget = await Budget.findOne({
        userId,
        budgetYear: transactionDate.getFullYear(),
        budgetMonth: transactionDate.getMonth() + 1,
        isActive: true,
      });

      if (!targetBudget) {
        applyLedgerToBudget(oldBudget, transaction.type, transaction.amount, 1);
        await oldBudget.save();
        return res.status(400).json({
          success: false,
          message: 'No active budget found for this period',
        });
      }

      const amt = parseFloat(amount);
      const sameBudget = oldBudget._id.equals(targetBudget._id);

      if (sameBudget) {
        applyLedgerToBudget(oldBudget, type, amt, 1);
        await oldBudget.save();
      } else {
        applyLedgerToBudget(targetBudget, type, amt, 1);
        await oldBudget.save();
        await targetBudget.save();
      }

      transaction.categoryId = categoryId;
      transaction.budgetId = targetBudget._id;
      transaction.amount = amt;
      transaction.description = String(description).trim();
      transaction.merchant = merchant != null ? String(merchant).trim() : '';
      transaction.type = type;
      transaction.date = transactionDate;
      transaction.currency = currency || targetBudget.currency;
      transaction.tags = tags || [];
      transaction.notes = notes != null ? String(notes).trim() : '';

      await transaction.save();
      await transaction.populate('categoryId', 'name type color');

      return res.status(200).json({
        success: true,
        message: 'Transaction updated successfully',
        transaction: {
          ...transaction.getSummary(),
          category: transaction.categoryId,
        },
      });
    } catch (error) {
      console.error('Error updating transaction:', error);
      return res.status(500).json({ success: false, message: 'Failed to update transaction' });
    }
  }

  res.setHeader('Allow', ['PUT', 'DELETE']);
  return res.status(405).json({
    success: false,
    message: `Method ${req.method} not allowed`,
  });
}
