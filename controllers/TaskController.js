import Task from "../models/Task.js";

export const createTask = async (req, res) => {
  const { task_name, task_description } = req.body;
  try {
    const task = await Task.create({
      task_name,
      task_description,
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
    const tasks = await Task.findAll();
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
  const task = await Task.findOne({ where: { id: req.params.id } });
  if (!task) {
    return res.status(404).json({
      status: "error",
      message: "Task not found",
    });
  }
  const { task_status } = req.body; // Mendapatkan status tugas dari permintaan
  try {
    await Task.update({ task_status }, { where: { id: req.params.id } }); // Memperbarui status tugas
    return res.status(200).json({
      status: "success",
      message: "Task status updated",
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
    const task = await Task.findByPk(req.params.id);
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
