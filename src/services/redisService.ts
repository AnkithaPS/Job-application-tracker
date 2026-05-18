import { redisClient } from "../config/redis";

//get redis cache
export const getCache = async (key: string) => {
  const data = await redisClient.get(key);
  return data ? JSON.parse(data as string) : null;
};

//set cache
export const setCache = async (key: string, value: string) => {
  await redisClient.setEx(key, 300, value); //expiry 5 min
};

//delete cache
export const deleteCache = async (key: string) => {
  await redisClient.del(key);
};
