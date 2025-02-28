import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

const User = sequelize.define("User", {
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  name: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  phone: { 
    type: DataTypes.STRING, 
    unique: true, 
    allowNull: false 
  },
  password: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  profilePic: { 
    type: DataTypes.STRING, 
    allowNull: true 
  },
}, { 
  tableName: "users",
  timestamps: true 
});

export default User;
