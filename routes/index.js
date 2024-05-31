import express from "express";
const router = express.Router();

router.get("/home", (req, res) => {
  res.render("todolist", { title: "Home" });
});

export default router;
