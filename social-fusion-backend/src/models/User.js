import { DataTypes } from "sequelize";
import bcrypt from "bcrypt";
import sequelize from "../../config/database.js";

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: { args: [3, 50], msg: "Full Name must be between 3 and 50 characters." },
      },
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: { args: [3, 30], msg: "Username must be between 3 and 30 characters." },
        isAlphanumeric: { msg: "Username must contain only letters and numbers." },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: { msg: "Invalid email format." },
      },
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        is: {
          args: [/^\+?[1-9]\d{1,14}$/],
          msg: "Invalid phone number format.",
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    profilePic: {
      type: DataTypes.STRING, // Store Cloudinary URL
      allowNull: true,
      defaultValue: "https://res.cloudinary.com/your-cloud-name/image/upload/v1234567890/default-avatar.png",
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "users",
    timestamps: true,
    paranoid: true, // Soft delete users instead of hard delete
    indexes: [{ unique: true, fields: ["email", "username", "phoneNumber"] }],
    hooks: {
      beforeCreate: async (user) => {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      },
    },
  }
);

export default User;
