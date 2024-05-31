import { Sequelize, DataTypes } from "sequelize";
import config from "../config/config.js";
import User from "./UserModel.js"; // Import the User model

// Importing environment variables and configuring Sequelize
const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_DIALECT } = process.env;
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: DB_DIALECT,
});

// Defining your Task model
const Task = sequelize.define(
  "Task",
  {
    id_task: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    task_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    task_description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    task_status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    id_user: {
      // Add this line to define the foreign key
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "tasks",
    timestamps: true,
  }
);

export default Task;
