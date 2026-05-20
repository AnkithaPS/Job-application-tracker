"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = require("../controller/user");
const userRoute = express_1.default.Router();
/**
 * @swagger
 * tags:
 *  name: Authentication
 *  description: Authentication APIs
 */
/**
 * @swagger
 * /api/auth/register:
 *  post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *          application/json:
 *             schema:
 *               type: object
 *               required:
 *                - name
 *                - email
 *                - password
 *               properties:
 *                name:
 *                 type: string
 *                email:
 *                 type: string
 *                password:
 *                 type: string
 *     responses:
 *       201:
 *        description: success
 *        content:
 *         application/json:
 *          schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: User registered successfully!
 *             data:
 *               type: object
 *               example:
 *                  id: 1
 *                  name: Ankitha
 *                  email: an@gmail.com
 *
 *       400:
 *        description: Bad Request
 *        content:
 *         application/json:
 *           schema:
 *            type: object
 *            properties:
 *              message:
 *                type: string
 *                example: Email already exists!
 *
 */
userRoute.post("/register", user_1.registerUser);
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *          description: success
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          message:
 *                              type: string
 *                              example: User logged in successfully!
 *                          token:
 *                              type: string
 *                              example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ZDYzYWI3NGE1ZDUxNzVjZjI3MGIyNiIsImlhdCI6MTc3ODU3NjQyOSwiZXhwIjoxNzc4NjYyODI5fQ.aOB-YTRmIlt-YOOpnptaDP0pVFHxxJHP9RAO-Kt53x0
 *
 *       404:
 *          description: Not Found
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          message:
 *                              type: string
 *                              example: User not Found!
 *       400:
 *          description: Bad Request
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          message:
 *                              type: string
 *                              example: Invalid Password!, please try again
 *
 */
userRoute.post("/login", user_1.loginUser);
exports.default = userRoute;
