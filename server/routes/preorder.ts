import express from "express";
const router = express.Router();
const app = express();
import Preorder from "../models/preorder.js";

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get("/new/products/preorder", async (req, res) => {
  console.log("A request came to preorder API");
  let preOrderData = await Preorder.find({});

  interface OneResponse {
    id: any;
    category: any;
    title: any;
    description: any;
    price: any;
    texture: any;
    wash: any;
    place: any;
    note: any;
    story: any;
    target: any;
    accumulate: any;
    progress: any;
    colors: {
      code?: string | null | undefined;
      name?: string | null | undefined;
    }[];
    sizes: string[];
    main_image: any;
    images: string[];
  }

  interface ResponseData {
    data: OneResponse[];
  }

  const response: ResponseData = {
    data: [],
  };

  preOrderData.forEach((onePreOrder) => {
    let target = onePreOrder.target;
    let accumulate = onePreOrder.accumulate;
    let progress = null;
    if (
      accumulate !== null &&
      accumulate !== undefined &&
      target !== null &&
      target !== undefined
    ) {
      progress = (accumulate / target) * 100;
    }

    let colors: any[] = [];
    onePreOrder.colors.forEach((onePreOrderColors) => {
      let oneColor = {
        code: onePreOrderColors.code,
        name: onePreOrderColors.name,
      };
      colors.push(oneColor);
    });

    console.log(onePreOrder.colors);

    const oneResponse: OneResponse = {
      id: onePreOrder.id,
      category: onePreOrder.category,
      title: onePreOrder.title,
      description: onePreOrder.description,
      price: onePreOrder.price,
      texture: onePreOrder.texture,
      wash: onePreOrder.wash,
      place: onePreOrder.place,
      note: onePreOrder.note,
      story: onePreOrder.story,
      target: onePreOrder.target,
      accumulate: onePreOrder.accumulate,
      progress: progress,
      colors: colors,
      sizes: onePreOrder.sizes,
      main_image: onePreOrder.main_image,
      images: onePreOrder.images,
    };
    response.data.push(oneResponse);
  });

  // const initialCreatePreorder = new Preorder();
  // await initialCreatePreorder.save();

  res.status(200).send(response);
});

export default router;
