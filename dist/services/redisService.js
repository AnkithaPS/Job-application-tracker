"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCache = exports.setCache = exports.getCache = void 0;
const redis_1 = require("../config/redis");
//get redis cache
const getCache = async (key) => {
    const data = await redis_1.redisClient.get(key);
    return data ? JSON.parse(data) : null;
};
exports.getCache = getCache;
//set cache
const setCache = async (key, value) => {
    await redis_1.redisClient.setEx(key, 300, value); //expiry 5 min
};
exports.setCache = setCache;
//delete cache
const deleteCache = async (key) => {
    await redis_1.redisClient.del(key);
};
exports.deleteCache = deleteCache;
