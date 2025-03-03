import OTP from "./Otp.js";
import User from "./User.js";

User.hasMany(OTP, { foreignKey: "userId", onDelete: "CASCADE" });
OTP.belongsTo(User, { foreignKey: "userId" });
