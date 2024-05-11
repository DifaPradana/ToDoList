import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import index from "./routes/index.js";
import bodyParser from "body-parser";
import taskRoute from "./routes/taskRoute.js";

dotenv.config();

const app = express();

app.use(morgan("dev"));
app.use(bodyParser.json());

app.use(taskRoute);

app.listen(process.env.APP_PORT, () => {
  console.log(`Server is running on port ${process.env.APP_PORT}`);
});

app.use(index);
app.set("view engine", "ejs");
app.use(express.static("public"));
