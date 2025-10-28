import { connectToDatabase } from '../../../lib/mongodb';
import Budget from '../../../models/Budget';
import { verifyToken } from '../../../lib/jwt';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Verify authentication
    const token = req.headers.authorization?.replace('Bearer ', '') || req.cookies.token;
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const userId = decoded.userId;

    // Connect to database
    await connectToDatabase();

    const { monthlyIncome, startDate, spendingLimit, savingGoal, currency } = req.body;

    // Validate input
    if (!monthlyIncome || !startDate || !spendingLimit || savingGoal === undefined) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (monthlyIncome <= 0 || spendingLimit <= 0 || savingGoal < 0) {
      return res.status(400).json({ message: 'Invalid amounts provided' });
    }

    if (spendingLimit + savingGoal > monthlyIncome) {
      return res.status(400).json({ 
        message: 'Spending limit and saving goal cannot exceed monthly income' 
      });
    }

    // Parse the start date to get month and year
    const budgetStartDate = new Date(startDate);
    const budgetMonth = budgetStartDate.getMonth() + 1; // JavaScript months are 0-indexed
    const budgetYear = budgetStartDate.getFullYear();

    // Check if budget already exists for this month/year
    const existingBudget = await Budget.findOne({
      userId,
      budgetMonth,
      budgetYear,
      isActive: true
    });

    if (existingBudget) {
      // Update existing budget
      existingBudget.monthlyIncome = monthlyIncome;
      existingBudget.startDate = budgetStartDate;
      existingBudget.spendingLimit = spendingLimit;
      existingBudget.savingGoal = savingGoal;
      existingBudget.currency = currency || 'USD';
      
      await existingBudget.save();

      return res.status(200).json({
        success: true,
        message: 'Budget updated successfully',
        budget: existingBudget.getSummary()
      });
    } else {
      // Create new budget
      const newBudget = new Budget({
        userId,
        monthlyIncome,
        startDate: budgetStartDate,
        spendingLimit,
        savingGoal,
        currency: currency || 'USD',
        budgetMonth,
        budgetYear,
        currentSpent: 0,
        currentSaved: 0,
        isActive: true
      });

      await newBudget.save();

      return res.status(201).json({
        success: true,
        message: 'Budget created successfully',
        budget: newBudget.getSummary()
      });
    }

  } catch (error) {
    console.error('Budget setup error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: 'Validation error', 
        errors 
      });
    }

    return res.status(500).json({ 
      message: 'Internal server error' 
    });
  }
}