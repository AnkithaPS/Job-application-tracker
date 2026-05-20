"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const user_1 = __importDefault(require("./routes/user"));
const job_1 = __importDefault(require("./routes/job"));
const swagger_1 = require("./config/swagger");
const redis_1 = require("./config/redis");
const errorHandler_1 = require("./middleware/errorHandler");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)("dev"));
//Routers
app.use("/api/auth", user_1.default);
app.use("/api/jobs", job_1.default);
//swagger
app.use("/api-docs", swagger_1.swaggerUi.serve, swagger_1.swaggerUi.setup(swagger_1.swaggerSpec));
//Middleware error Handling
app.use(errorHandler_1.errorHandler);
//Start Server
const port = process.env.PORT || 5000;
const startServer = async () => {
    try {
        //connect redis
        await redis_1.redisClient.connect();
        console.log("Redis Connected");
        //start server
        app.listen(port, () => {
            console.log(`Server is running on PORT ${port}`);
        });
    }
    catch (error) {
        console.log(`Failed to start server: ${error}`);
    }
};
startServer();
