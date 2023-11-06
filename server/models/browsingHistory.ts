import pool from "./databasePool.js";
import { ResultSetHeader } from "mysql2";
import { OkPacket, RowDataPacket } from "mysql2/promise";
import { z } from "zod";

import { PAGE_COUNT } from "./product.js";

function instanceOfSetHeader(object: any): object is ResultSetHeader {
  return "insertId" in object;
}

const timestampSchema = z.instanceof(Date);

export const browsingHistorySchema = z.object({
  id: z.number(),
  user_id: z.number(),
  product_id: z.number(),
  created_at: timestampSchema,
});

export async function getBrowsingHistory({
  paging = 0,
  userId,
}: {
  paging: number;
  userId: number;
}) {
  try {
    console.log(userId);
    const results = await pool.query(
      `
    SELECT * FROM histories 
    WHERE user_id = ? 
    ORDER BY created_at
    LIMIT ? OFFSET ?
    `,
      [userId, PAGE_COUNT, paging * PAGE_COUNT]
    );

    const histories = z.array(browsingHistorySchema).parse(results[0]);
    return histories;
  } catch (err) {
    console.error(err);
  }
}

export async function createHistory(productId: number, userId: number) {
  const results = await pool.query(
    `
    INSERT INTO histories (product_id, user_id)
    VALUES(?, ?)
  `,
    [productId, userId]
  );
  if (Array.isArray(results) && instanceOfSetHeader(results[0])) {
    return results[0].insertId;
  }
  throw new Error("create history failed");
}
