import express from "express";
import { authenticateMiddleware } from "../middleware/authMiddleware";
import { createJob, getJobs, updateJobs } from "../controller/job";

const jobRouter = express.Router();
jobRouter.post("/add", authenticateMiddleware, createJob);
jobRouter.get("/find", authenticateMiddleware, getJobs);
jobRouter.patch("/:id/update", authenticateMiddleware, updateJobs);

export default jobRouter;
