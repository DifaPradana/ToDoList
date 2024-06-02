import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import index from "./routes/index.js";
import UserRoute from "./routes/UserRoute.js";
import bodyParser from "body-parser";
import taskRoute from "./routes/taskRoute.js";
import cookieParser from "cookie-parser";
import mqtt from "mqtt";

dotenv.config();

const app = express();
app.use(cookieParser());

const mqttClient = mqtt.connect("www://broker.mqtt-dashboard.com");

mqttClient.on("connect", () => {
  console.log("Connected to MQTT broker at broker.mqtt-dashboard.com");
  mqttClient.subscribe("do_to_learn/piranti_bergerak", (err) => {
    if (!err) {
      console.log("Subscribed to do_to_learn/piranti_bergerak");
    }
  });
});

mqttClient.on("message", (topic, message) => {
  // message is Buffer
  console.log(`Received message: ${message.toString()} on topic: ${topic}`);
});

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

export { mqttClient };
