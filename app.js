import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import index from "./routes/index.js";
import UserRoute from "./routes/UserRoute.js";
import bodyParser from "body-parser";
import taskRoute from "./routes/taskRoute.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
app.use(cookieParser());

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true })); // Menggunakan true untuk mendukung parsing nested objects
app.use(bodyParser.json());
app.use(cookieParser());

app.use(taskRoute);

app.listen(process.env.APP_PORT, () => {
  console.log(`Server is running on port ${process.env.APP_PORT}`);
});

app.use(index);
app.use(UserRoute);
app.set("view engine", "ejs");
app.use(express.static("public"));
