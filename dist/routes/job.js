"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const job_1 = require("../controller/job");
const redisRateLimit_1 = require("../middleware/redisRateLimit");
const jobRouter = express_1.default.Router();
jobRouter.post("/add", authMiddleware_1.authenticateMiddleware, redisRateLimit_1.limit, job_1.createJob);
jobRouter.get("/find", authMiddleware_1.authenticateMiddleware, redisRateLimit_1.limit, job_1.getJobs);
jobRouter.patch("/:id/update", authMiddleware_1.authenticateMiddleware, redisRateLimit_1.limit, job_1.updateJobs);
exports.default = jobRouter;
