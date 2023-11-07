import pool from "./databasePool.js";
import { ResultSetHeader } from "mysql2";
import { z } from "zod";

export const storeSchema = z.object({
  id: z.number(),
  name: z.string(),
  lat: z.string(),
  lng: z.string(),
  address: z.string(),
  phone: z.string(),
  open_time: z.string(),
  close_time: z.string(),
});

export async function getStores() {
  try {
    const results = await pool.query(`SELECT * FROM stores`);

    const stores = z.array(storeSchema).parse(results[0]);
    return stores;
  } catch (err) {
    console.error(err);
  }
}
