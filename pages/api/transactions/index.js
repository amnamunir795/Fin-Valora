import connectDB from '../../../lib/mongodb';
import Transaction from '../../../models/Transaction';
import Category from '../../../models/Category';
import Budget from '../../../models/Budget';
import { verifyRequestAuth } from '../../../middleware/auth';

export default async function handler(req, res) {
  await connectDB();

  // Verify authentication
  const authResult = await verifyRequestAuth(req);
  if (!authResult.success) {
    return res.status(401).json({ success: false, message: authResult.message });
  }

  const userId = authResult.user.id;

  switch (req.method) {
    case 'GET':
      try {
        const { 
          startDate, 
          endDate, 
          categoryId, 
          type, 
          limit = 50, 
          page = 1 
        } = req.query;

        let query = { userId };

        // Add filters
        if (startDate && endDate) {
          query.date = {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
          };
        }

        if (categoryId) {
          query.categoryId = categoryId;
        }

        if (type && ['Income', 'Expense'].includes(type)) {
          query.type = type;
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const transactions = await Transaction.find(query)
          .populate('categoryId', 'name type color')
          .sort({ date: -1 })
          .skip(skip)
          .limit(parseInt(limit));

        const total = await Transaction.countDocuments(query);

        res.status(200).json({
          success: true,
          transactions: transactions.map(t => ({
            ...t.getSummary(),
            category: t.categoryId
          })),
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / parseInt(limit))
          }
        });
      } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({
          success: false,
          message: 'Failed to fetch transactions'
        });
      }
      break;

    case 'POST':
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
          notes
        } = req.body;

        // Validation
        if (!categoryId || !amount || !description || !type || !date) {
          return res.status(400).json({
            success: false,
            message: 'Category, amount, description, type, and date are required'
          });
        }

        if (!['Income', 'Expense'].includes(type)) {
          return res.status(400).json({
            success: false,
            message: 'Type must be either Income or Expense'
          });
        }

        // Verify category belongs to user
        const category = await Category.findOne({
          _id: categoryId,
          userId,
          isActive: true
        });

        if (!category) {
          return res.status(400).json({
            success: false,
            message: 'Invalid category'
          });
        }

        // Verify category type matches transaction type
        if (category.type !== type) {
          return res.status(400).json({
            success: false,
            message: 'Category type does not match transaction type'
          });
        }

        // Get current budget
        const transactionDate = new Date(date);
        const budget = await Budget.findOne({
          userId,
          budgetYear: transactionDate.getFullYear(),
          budgetMonth: transactionDate.getMonth() + 1,
          isActive: true
        });

        if (!budget) {
          return res.status(400).json({
            success: false,
            message: 'No active budget found for this period'
          });
        }

        // Create transaction
        const transaction = new Transaction({
          userId,
          categoryId,
          budgetId: budget._id,
          amount: parseFloat(amount),
          description: description.trim(),
          merchant: merchant?.trim() || '',
          type,
          date: transactionDate,
          currency: currency || budget.currency,
          tags: tags || [],
          notes: notes?.trim() || ''
        });

        await transaction.save();

        // Update budget totals
        if (type === 'Expense') {
          budget.currentSpent += parseFloat(amount);
        } else if (type === 'Income') {
          // For income, we might want to add to savings or adjust budget
          // This depends on your business logic
        }

        await budget.save();

        // Populate category for response
        await transaction.populate('categoryId', 'name type color');

        res.status(201).json({
          success: true,
          message: 'Transaction created successfully',
          transaction: {
            ...transaction.getSummary(),
            category: transaction.categoryId
          }
        });
      } catch (error) {
        console.error('Error creating transaction:', error);
        res.status(500).json({
          success: false,
          message: 'Failed to create transaction'
        });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).json({
        success: false,
        message: `Method ${req.method} not allowed`
      });
  }
}