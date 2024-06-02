import Task from "../models/TaskModel.js";
import { mqttClient } from "../app.js"; // Import the MQTT client

export const createTask = async (req, res) => {
  const { task_name, task_description } = req.body;
  try {
    const task = await Task.create({
      task_name,
      task_description,
      id_user: req.id_user,
    });
    return res.status(201).json({
      status: "success",
      data: task,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.findAll({ where: { id_user: req.id_user } });

    return res.status(200).json({
      status: "success",
      data: tasks,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const editTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      where: { id_task: req.params.id, id_user: req.id_user },
    });

    if (!task) {
      return res.status(404).json({
        status: "error",
        message: "Task not found",
      });
    }
    const { task_status } = req.body;
    await Task.update(
      { task_status },
      { where: { id_task: req.params.id, id_user: req.id_user } }
    );

    // Count tasks with task_status = false
    const count = await Task.count({
      where: { task_status: false, id_user: req.id_user },
    });

    if (count === 0) {
      // Perform action when there are no tasks with task_status = false
      const message = "All tasks are complete";
      mqttClient.publish("do_to_learn/piranti_bergerak", message, (err) => {
        if (err) {
          console.error("Failed to publish MQTT message", err);
        } else {
          console.log(`MQTT message sent: ${message}`);
        }
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Task status updated",
      count: count,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      where: { id: req.params.id, id_user: req.id_user },
    });
    if (!task) {
      return res.status(404).json({
        status: "error",
        message: "Task not found",
      });
    }
    await task.destroy();
    return res.status(200).json({
      status: "success",
      message: "Task deleted",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
