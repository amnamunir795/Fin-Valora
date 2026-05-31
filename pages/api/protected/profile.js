import connectDB from "../../../lib/mongodb";
import { verifyRequestAuth } from "../../../middleware/auth";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ message: "Method not allowed" });
  try {
    await connectDB();
    const authResult = await verifyRequestAuth(req);
    if (!authResult.success) return res.status(401).json({ success: false, message: authResult.message });
    return res.status(200).json({ success: true, message: "Protected route accessed", user: authResult.user });
  } catch (error) {
    console.error("Profile error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
