import cors from "cors";
import express from "express";
import bodyParser from "body-parser";
import helmet from "helmet";
import * as dotenv from "dotenv";
import { ValidationError } from "class-validator";

import { authenticateAccessToken } from "./util/jwtHelper";
import connect from "./util/connect";
import authRouter from "./routes/v1.0/authRoutes";
import userRouter from "./routes/v1.0/userRoutes";
import incidentRouter from "./routes/v1.0/incidentRoutes";


dotenv.config();

const app = express();
const PORT = process.env.NODE_DOCKER_PORT || 8080;
const corsOptions = {
  origin: process.env.CLIENT_ORIGIN || "http://localhost:80",
};

/**
 * MW configuration
 */
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    limit: "5mb",
    extended: true,
    parameterLimit: 5000,
  })
);
app.use(express.static("public"));

/**
 * API Configuration
 */
app.use("/api/v1.0/auth", authRouter);
app.use("/api/v1.0/user", authenticateAccessToken, userRouter);
app.use("/api/v1.0/incident", authenticateAccessToken, incidentRouter);


connect({
  db: `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false&replicaSet=rs`,
});
/**
 * Custom Error Handlers
 */

app.on("error", (err: any) => {
  return (req: any, res: any, next: any) => {
    console.log("exception: " + err);
    res.status(500).send("Something went wrong");
  };
});
app.on("uncaughtException", (err: any) => {
  return (req: any, res: any, next: any) => {
    console.log("exception: " + err);
    res.status(500).send("Something went wrong");
  };
});
app.on(
  "unhandledRejection",
  (err: ValidationError | ValidationError[] | any) => {
    return (req: any, res: any, next: any) => {
      res.status(500).send("Something went wrong");
    };
  }
);

/**
 * Server Activation
 */
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
