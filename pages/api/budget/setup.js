import connectDB from "../../../lib/mongodb";
import Budget from "../../../models/Budget";
import { authenticateToken } from "../../../middleware/auth";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Apply authentication middleware
  return new Promise((resolve) => {
    authenticateToken(req, res, async () => {
      try {
        const userId = req.user.id;

        // Connect to database
        await connectDB();

        const {
          monthlyIncome,
          startDate,
          spendingLimit,
          savingGoal,
          currency,
        } = req.body;

        // Validate input
        if (
          !monthlyIncome ||
          !startDate ||
          !spendingLimit ||
          savingGoal === undefined
        ) {
          res.status(400).json({ message: "All fields are required" });
          resolve();
          return;
        }

        if (monthlyIncome <= 0 || spendingLimit <= 0 || savingGoal < 0) {
          res.status(400).json({ message: "Invalid amounts provided" });
          resolve();
          return;
        }

        if (spendingLimit + savingGoal > monthlyIncome) {
          res.status(400).json({
            message:
              "Spending limit and saving goal cannot exceed monthly income",
          });
          resolve();
          return;
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
          isActive: true,
        });

        if (existingBudget) {
          // Update existing budget
          existingBudget.monthlyIncome = monthlyIncome;
          existingBudget.startDate = budgetStartDate;
          existingBudget.spendingLimit = spendingLimit;
          existingBudget.savingGoal = savingGoal;
          existingBudget.currency = currency || "USD";

          await existingBudget.save();

          res.status(200).json({
            success: true,
            message: "Budget updated successfully",
            budget: existingBudget.getSummary(),
          });
          resolve();
        } else {
          // Create new budget
          const newBudget = new Budget({
            userId,
            monthlyIncome,
            startDate: budgetStartDate,
            spendingLimit,
            savingGoal,
            currency: currency || "USD",
            budgetMonth,
            budgetYear,
            currentSpent: 0,
            currentSaved: 0,
            isActive: true,
          });

          await newBudget.save();

          res.status(201).json({
            success: true,
            message: "Budget created successfully",
            budget: newBudget.getSummary(),
          });
          resolve();
        }
      } catch (error) {
        console.error("Budget setup error:", error);

        if (error.name === "ValidationError") {
          const errors = Object.values(error.errors).map((err) => err.message);
          res.status(400).json({
            message: "Validation error",
            errors,
          });
          resolve();
          return;
        }

        res.status(500).json({
          message: "Internal server error",
        });
        resolve();
      }
    });
  });
}
