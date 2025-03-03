import cron from "node-cron";
import { Op } from "sequelize"; // Required for expiration query
import OTP from "../models/Otp.js";


// Run every 5 minutes to delete expired OTPs
cron.schedule("*/5 * * * *", async () => {
  try {
    const deletedCount = await OTP.destroy({
      where: {
        expiresAt: { [Op.lt]: new Date() }, // Delete expired OTPs
      },
    });

    if (deletedCount > 0) {
      console.log(`✅ Cleaned up ${deletedCount} expired OTPs.`);
    }
  } catch (error) {
    console.error("❌ Error deleting expired OTPs:", error);
  }
});

export default cron;
