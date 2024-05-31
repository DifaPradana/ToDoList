import express from "express";
import {
  createUser,
  Login,
  Logout,
  ViewLogin,
  ViewRegister,
} from "../controllers/UserController.js";

const router = express.Router();

router.get("/", ViewLogin);
router.get("/login", ViewLogin);
router.get("/register", ViewRegister);
// router.get("/users", getUsers);
router.post("/register", createUser);
router.post("/login", Login);
router.delete("/logout", Logout);

// router.put("/users/:id", editUser);
// router.delete("/users/:id", deleteUser);

export default router;
