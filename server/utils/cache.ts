import { Redis } from "ioredis";

let cache: Redis;

if ((process.env.NODE_ENV = "dev")) {
  cache = new Redis({
    port: 6379, // Redis port
    host: process.env.REDIS_HOST,
    commandTimeout: 300,
  });
} else {
  cache = new Redis({
    port: 6379, // Redis port
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD,
    tls: {},
    commandTimeout: 300,
  });
}

export { cache };

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
