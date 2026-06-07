import connectDB from "../../../lib/mongodb";
import User from "../../../models/User";
import { verifyRequestAuth } from "../../../middleware/auth";

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

    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ success: false, message: "All password fields are required" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ success: false, message: "New passwords do not match" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: "New password must be at least 6 characters long" });
    }

    if (newPassword === currentPassword) {
      return res.status(400).json({ success: false, message: "New password must differ from current password" });
    }

    // password has select:false — request it explicitly
    const user = await User.findById(authResult.user.id).select("+password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Current password is incorrect" });
    }

    user.password = newPassword; // pre-save hook hashes it
    await user.save();

    return res.status(200).json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("Password update error:", error);
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ success: false, message: "Validation error", errors });
    }
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}
