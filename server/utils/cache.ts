import { Redis } from "ioredis";

export const cache = new Redis({
  port: 6379, // Redis port
  //host: `REDISSETUP=redis://default:annann23@127.0.0.1:6379`,
  host: "localhost",
  // username: process.env.REDIS_USER,
  password: "",
  //commandTimeout: 300,
});

export async function get(key: string) {
  try {
    const result = await cache.get(key);
    return result;
  } catch (err) {
    return null;
  }
}

export async function set(key: string, value: string) {
  try {
    const result = await cache.set(key, value);
    return result;
  } catch (err) {
    return null;
  }
}

export async function del(key: string) {
  try {
    const result = await cache.del(key);
    return result;
  } catch (err) {
    return null;
  }
}

export const getCampaignKey = () => {
  return "campaigns";
};
