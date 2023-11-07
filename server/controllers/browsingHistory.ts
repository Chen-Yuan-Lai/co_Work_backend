import { Request, Response } from "express";
import { object, string, z } from "zod";
import { isUserHasRole } from "../models/role.js";

import * as productModel from "../models/product.js";
import * as browsingHistoryModel from "../models/browsingHistory.js";

interface SendProduct {
  id: number;
  category: string;
  title: string;
  main_image: string;
  price: number;
}

export async function getBrowsingHistory(req: Request, res: Response) {
  try {
    const paging = Number(req.query.paging) || 0;
    const userId = res.locals.userId;

    if (await isUserHasRole(userId, "admin"))
      throw new Error("Not has user role");

    const histories = await browsingHistoryModel.getBrowsingHistory({
      paging,
      userId,
    });

    let historyPromises: any = [];

    historyPromises = histories?.map(async (el) => {
      const [product] = await productModel.getProduct(el.product_id);
      const image = await productModel.getMainImage(el.product_id);

      const sendProduct: SendProduct = {
        id: product.id,
        category: product.category,
        title: product.title,
        main_image: image,
        price: product.price,
      };

      return {
        timestamp: el.created_at,
        data: sendProduct,
      };
    });

    let historyData = await Promise.all(historyPromises);

    res.status(200).json({
      records: historyData,
    });
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({ errors: err.message });
      return;
    }
    return res.status(500).json({ errors: "get histories failed" });
  }
}
