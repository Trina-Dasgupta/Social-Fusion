import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";
import User from "./User.js";
import Chat from "./Chat.js";

const Message = sequelize.define("Message", {
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  senderId: { 
    type: DataTypes.INTEGER, 
    allowNull: false, 
    references: { model: User, key: "id" } 
  },
  chatId: { 
    type: DataTypes.INTEGER, 
    allowNull: false, 
    references: { model: Chat, key: "id" } 
  },
  text: { 
    type: DataTypes.TEXT, 
    allowNull: true 
  },
  type: { 
    type: DataTypes.ENUM("text", "image", "video", "document"), 
    allowNull: false 
  },
}, { 
  tableName: "messages",
  timestamps: true 
});

export default Message;
