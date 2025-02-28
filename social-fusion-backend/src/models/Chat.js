import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

const Chat = sequelize.define("Chat", {
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  type: { 
    type: DataTypes.ENUM("private", "group"), 
    allowNull: false 
  },
}, { 
  tableName: "chats",
  timestamps: true 
});

export default Chat;
