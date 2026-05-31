import connectDB from "../../../lib/mongodb";
import Budget from "../../../models/Budget";
import { verifyRequestAuth } from "../../../middleware/auth";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ message: "Method not allowed" });
  try {
    await connectDB();
    const authResult = await verifyRequestAuth(req);
    if (!authResult.success) return res.status(401).json({ success: false, message: authResult.message });
    const budget = await Budget.findCurrentBudget(authResult.user.id);
    if (!budget) return res.status(404).json({ success: false, message: "No active budget found" });
    return res.status(200).json({ success: true, budget: budget.getSummary(), budgetMonth: budget.budgetMonth, budgetYear: budget.budgetYear });
  } catch (error) {
    console.error("Budget current error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
