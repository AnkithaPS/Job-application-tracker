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
/**
 * @swagger
 * tags:
 *    name: Job Tracker
 *    description: Job APplication Tracker Api
 */
/**
 * @swagger
 * /api/jobs:
 *   post:
 *     summary: Create new job deatils
 *     tags: [Job Tracker]
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - company
 *              - position
 *              - status
 *            properties:
 *              company:
 *                type: string
 *                example: Google
 *              position:
 *                type: string
 *                example: SDE
 *              status:
 *                type: string
 *                example: Applied
 *              salary:
 *                type: number
 *                example: 2000000
 *              location:
 *                type: string
 *                example: Bengaluru
 *              notes:
 *                type: string
 *                example: Just Applied for company
 *     responses:
 *      200:
 *        description: success
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  example: Job Created successfully!
 *                data:
 *                  example:
 *                    company:
 *                      id: 4
 *                      name: Google
 *                      location: Bengaluru
 *                      created_at: 2026-05-20T09:16:58.681Z
 *                    jobs:
 *                      id: 4
 *                      status: Applied
 *                      user_id: 1
 *                      company_id: 4
 *                      position: SDE
 *                      salary: 2000000
 *                      notes: Just Applied for company
 *                      created_at: 2026-05-20T09:16:58.681Z
 */
jobRouter.post("/", authMiddleware_1.authenticateMiddleware, redisRateLimit_1.limit, job_1.createJob);
/**
 * @swagger
 * /api/jobs:
 *   get:
 *     summary: Fetch job details
 *     tags: [Job Tracker]
 *     parameters:
 *      - in: query
 *        name: search
 *        required: false
 *        description: keyword to search
 *        schema:
 *          type: string
 *          example: google
 *      - in: query
 *        name: page
 *        required: false
 *        description: Page Number
 *        schema:
 *          type: Integer
 *          example: 1
 *      - in: query
 *        name: limit
 *        required: false
 *        description: Limit of data per page
 *        schema:
 *          type: Integer
 *          example: 10
 *
 *     responses:
 *      200:
 *        description: success
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: Job details
 *                data:
 *                  type: object
 *                  example:
 *                  - id: 4
 *                    company_name: Google
 *                    position: SDE
 *                    status: Applied
 *                    location: Bengaluru
 *                    salary: 2000000
 *                    user_id: 1
 *                    notes: Just Applied for company
 *                    created_at: 2026-05-20T09:16:58.681Z
 *                pagination:
 *                    type: object
 *                    example:
 *                      totalData: 1
 *                      page: 1
 *                      limit: 10
 *                      totalPages: 1
 */
jobRouter.get("/", authMiddleware_1.authenticateMiddleware, redisRateLimit_1.limit, job_1.getJobs);
/**
 * @swagger
 * /api/jobs/{id}:
 *    put:
 *     summary: Updating job details
 *     tags: [Job Tracker]
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: Job ID
 *        schema:
 *          type: integer
 *          example: 1
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              status:
 *                type: string
 *                example: Interview
 *              notes:
 *                type: string
 *                example: Interview is done on 20th May
 *     responses:
 *      200:
 *        description: success
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: Job updated successfully!
 *                data:
 *                  type: object
 *                  example:
 *                    id: 4
 *                    company_name: Google
 *                    company_id: 1
 *                    position: SDE
 *                    status: Applied
 *                    location: Bengaluru
 *                    salary: 2000000
 *                    user_id: 1
 *                    notes: Just Applied for company
 *                    created_at: 2026-05-20T09:16:58.681Z
 *      400:
 *          description: Bad Request
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          message:
 *                              type: string
 *                              example: Job id required
 */
jobRouter.put("/:id", authMiddleware_1.authenticateMiddleware, redisRateLimit_1.limit, job_1.updateJobs);
/**
 * @swagger
 * /api/jobs/{id}:
 *    delete:
 *     summary: Delete job details
 *     tags: [Job Tracker]
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: Job ID
 *        schema:
 *          type: integer
 *          example: 1
 *
 *     responses:
 *      200:
 *        description: success
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: Job deleted successfully!
 *
 *      400:
 *          description: Bad Request
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          message:
 *                              type: string
 *                              example: Job id required
 */
jobRouter.delete("/:id", authMiddleware_1.authenticateMiddleware, redisRateLimit_1.limit, job_1.deleteJob);
exports.default = jobRouter;
/**
 * @swagger
 * /api/jobs/analytics:
 *    get:
 *     summary: Job Analytics
 *     tags: [Job Tracker]
 *
 *     responses:
 *      200:
 *        description: success
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: Job Analytics
 *                data:
 *                  type: object
 *                  example:
 *                  - status: Applied
 *                    total: 2
 *                  - status: Interview
 *                    total: 2
 */
jobRouter.get("/analytics", authMiddleware_1.authenticateMiddleware, redisRateLimit_1.limit, job_1.jobAnalytic);
