"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerUi = exports.swaggerSpec = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
exports.swaggerUi = swagger_ui_express_1.default;
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Job Application Tracker",
            version: "1.0.0",
            description: `
A production-ready Job Application Tracker API built using Node.js, Express, TypeScript, PostgreSQL, Redis, JWT authentication, and Docker.

This API allows users to securely register and log in using JWT-based authentication, manage job applications, search and filter jobs, and perform CRUD operations with pagination support.
`,
        },
        servers: [
            { url: "http://localhost:5000" },
            { url: "https://ai-resume-analyzer-lmuy.onrender.com" },
        ],
        tags: [{ name: "Authentication" }, { name: "Job Tracker" }],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ["./src/routes/*.ts", "./dist/routes/*.js"],
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
exports.swaggerSpec = swaggerSpec;
