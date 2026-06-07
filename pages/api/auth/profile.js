import connectDB from "../../../lib/mongodb";
import User from "../../../models/User";
import { verifyRequestAuth } from "../../../middleware/auth";
import { SUPPORTED_CURRENCIES } from "../../../constants/currencies";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    await connectDB();

    const authResult = await verifyRequestAuth(req);
    if (!authResult.success) {
      return res.status(401).json({ success: false, message: authResult.message });
    }

    const { firstName, lastName, currency } = req.body;

    if (!firstName || !lastName) {
      return res.status(400).json({ success: false, message: "First and last name are required" });
    }

    if (firstName.trim().length > 50 || lastName.trim().length > 50) {
      return res.status(400).json({ success: false, message: "Name cannot be more than 50 characters" });
    }

    if (currency && !SUPPORTED_CURRENCIES.includes(currency)) {
      return res.status(400).json({ success: false, message: `Currency ${currency} is not supported` });
    }

    const user = await User.findById(authResult.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.firstName = firstName.trim();
    user.lastName = lastName.trim();
    if (currency) user.currency = currency;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        currency: user.currency,
        fullName: user.fullName,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Profile update error:", error);
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ success: false, message: "Validation error", errors });
    }
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}
