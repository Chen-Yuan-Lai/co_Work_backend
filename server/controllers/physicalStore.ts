import { Request, Response } from "express";

import * as productModel from "../models/product.js";
import * as productVariantModel from "../models/productVariant.js";
import * as physicalStoreModel from "../models/physicalStore.js";

export async function getStores(req: Request, res: Response) {
  try {
    const id = Number(req.query.id);

    const variants = await productVariantModel.getProductVariants([id]);
    const stores = await physicalStoreModel.getStores();

    const shopStocks = stores?.map((s) => {
      const randomNum: Number = Math.floor(Math.random() * 10 + 1);

      return {
        ...s,
        stock: randomNum,
      };
    });
    const variantsData = variants?.map((v) => {
      return {
        color_code: v.color,
        size: v.size,
        shopStocks,
      };
    });

    res.status(200).json({
      data: variantsData,
    });
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ errors: err.message });
      return;
    }
    res.status(500).json({ errors: "get campaigns failed" });
  }
}
