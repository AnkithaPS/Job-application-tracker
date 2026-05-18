import { createClient } from "redis";
import dotenv from "dotenv";
dotenv.config();

export const redisClient = createClient({
  url: process.env.REDIS_URL,
});
redisClient.on("error", (err) => console.error("RedisError:", err));

// async () => {
//   try {
//     await redisClient.connect();
//   } catch (error) {
//     console.log("Redis connection failed:", error);
//   }
// };
