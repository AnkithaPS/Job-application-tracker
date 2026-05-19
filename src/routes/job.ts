import express from "express";
import { authenticateMiddleware } from "../middleware/authMiddleware";
import {
  createJob,
  getJobs,
  getJobSearch,
  updateJobs,
} from "../controller/job";
import { limit } from "../middleware/redisRateLimit";
const jobRouter = express.Router();
jobRouter.post("/add", authenticateMiddleware, limit, createJob);
jobRouter.get("/findall", authenticateMiddleware, limit, getJobs);
jobRouter.get("/find", authenticateMiddleware, limit, getJobSearch);
jobRouter.patch("/:id/update", authenticateMiddleware, limit, updateJobs);

export default jobRouter;
