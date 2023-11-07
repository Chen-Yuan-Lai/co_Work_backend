// import { ResultSetHeader } from "mysql2";
// import { string, z } from "zod";
// import pool from "./databasePool.js";

// export const PAGE_COUNT = 6;

// const PreorderSchema = z.object({
//   preorder_id: z.number(),
//   product_id: z.number(),
//   target: z.number(),
//   accmulate: z.number(),
// });

// export async function getPreorders({ paging = 0 }: { paging: number }) {
//   const results = await pool.query(
//     `
//     SELECT * FROM preorder
//     ORDER BY id DESC
//     LIMIT ? OFFSET ?
//   `,
//     [PAGE_COUNT, paging * PAGE_COUNT]
//   );
//   const products = z.array(PreorderSchema).parse(results[0]);
//   return products;
// }
