import connectDB from '../../../lib/mongodb';
import Budget from '../../../models/Budget';
import { authenticateToken } from '../../../middleware/auth';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Apply authentication middleware
  return new Promise((resolve) => {
    authenticateToken(req, res, async () => {
      try {
        const userId = req.user.id;

        // Connect to database
        await connectDB();

        // Get all budgets for this user
        const allBudgets = await Budget.find({ userId }).sort({ createdAt: -1 });

        // Get current date info
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1;

        // Try to find current budget
        const currentBudget = await Budget.findCurrentBudget(userId);

        res.status(200).json({
          success: true,
          userId: userId,
          currentDate: {
            year: currentYear,
            month: currentMonth,
            date: now.toISOString()
          },
          totalBudgets: allBudgets.length,
          budgets: allBudgets.map(budget => ({
            id: budget._id,
            budgetYear: budget.budgetYear,
            budgetMonth: budget.budgetMonth,
            monthlyIncome: budget.monthlyIncome,
            spendingLimit: budget.spendingLimit,
            savingGoal: budget.savingGoal,
            isActive: budget.isActive,
            startDate: budget.startDate,
            createdAt: budget.createdAt
          })),
          currentBudget: currentBudget ? {
            id: currentBudget._id,
            budgetYear: currentBudget.budgetYear,
            budgetMonth: currentBudget.budgetMonth,
            monthlyIncome: currentBudget.monthlyIncome,
            spendingLimit: currentBudget.spendingLimit,
            savingGoal: currentBudget.savingGoal,
            isActive: currentBudget.isActive
          } : null
        });
        resolve();
      } catch (error) {
        console.error('List budgets error:', error);
        res.status(500).json({ 
          success: false,
          error: error.message 
        });
        resolve();
      }
    });
  });
}