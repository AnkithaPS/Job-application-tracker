import express from "express";
import { authenticateMiddleware } from "../middleware/authMiddleware";
import { createJob, getJobs, updateJobs, deleteJob } from "../controller/job";
import { limit } from "../middleware/redisRateLimit";
const jobRouter = express.Router();

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
 *                  type: string
 *                  example: Job Created successfully!
 *                data:
 *                  type: object
 *                  example:
 *                    id: 4
 *                    company: Google
 *                    position: SDE
 *                    status: Applied
 *                    location: Bengaluru
 *                    salary: 2000000
 *                    user_id: 1
 *                    notes: Just Applied for company
 *                    created_at: 2026-05-20T09:16:58.681Z
 */

jobRouter.post("/", authenticateMiddleware, limit, createJob);

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
 *                    company: Google
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

jobRouter.get("/", authenticateMiddleware, limit, getJobs);

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
 *                example: Interviewed
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
 *                    company: Google
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

jobRouter.put("/:id", authenticateMiddleware, limit, updateJobs);
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
jobRouter.delete("/:id", authenticateMiddleware, limit, deleteJob);
export default jobRouter;
