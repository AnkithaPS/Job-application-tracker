"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.limit = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const rate_limit_redis_1 = __importDefault(require("rate-limit-redis"));
const redis_1 = require("../config/redis");
exports.limit = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, //15min
    max: 100, //100 request per 15min
    message: "Too many request!,please try again later",
    standardHeaders: true,
    legacyHeaders: false,
    store: new rate_limit_redis_1.default({
        sendCommand: (...args) => redis_1.redisClient.sendCommand(args),
    }),
});
