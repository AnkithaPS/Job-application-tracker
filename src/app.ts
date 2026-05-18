import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import userRouter from "./routes/user";
import jobRouter from "./routes/job";
import { redisClient } from "./config/redis";
import { errorHandler } from "./middleware/errorHandler";
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

//Routers
app.use("/api/auth", userRouter);
app.use("/api/jobs", jobRouter);

//Middleware error Handling
app.use(errorHandler);

//Start Server
const port = process.env.PORT || 5000;
const startServer = async () => {
  try {
    //connect redis
    await redisClient.connect();
    console.log("Redis Connected");
    //start server
    app.listen(port, () => {
      console.log(`Server is running on PORT ${port}`);
    });
  } catch (error) {
    console.log(`Failed to start server: ${error}`);
  }
};
startServer();
