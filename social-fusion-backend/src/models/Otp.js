import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";
import User from "./User.js"; 

const OTP = sequelize.define(
  "OTP",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    otp: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: () => new Date(Date.now() + 10 * 60 * 1000), 
    },
  },
  {
    tableName: "otp",
    timestamps: true,
    indexes: [
      { fields: ["userId"], name: "idx_userId" }, 
    ],
  }
);


export default OTP;
