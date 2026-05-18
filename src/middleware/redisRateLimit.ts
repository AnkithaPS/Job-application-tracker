import rateLimit from "express-rate-limit";
import redisStore from "rate-limit-redis";
import { redisClient } from "../config/redis";

export const limit = rateLimit({
  windowMs: 15 * 60 * 1000, //15min
  max: 100, //100 request per 15min
  message: "Too many request!,please try again later",
  standardHeaders: true,
  legacyHeaders: false,
  store: new redisStore({
    sendCommand: (...args: string[]) => redisClient.sendCommand(args),
  }),
});
