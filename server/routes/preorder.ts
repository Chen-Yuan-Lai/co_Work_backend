import express from "express";
const router = express.Router();
const app = express();
import Preorder from "../models/preorder.js";

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get("/new/products/preorder", async (req, res) => {
  console.log("A request came to preorder API");
  let preOrderData = await Preorder.find({});
  console.log(preOrderData);

  const initialCreatePreorder = new Preorder({
    id: 1234,
    category: "preorder",
    title: "真的是IKEA狗狗",
    description: "會坐不會站",
    price: 699,
    texture: "聚脂纖維",
    wash: "手洗（水溫40度",
    place: "韓國",
    note: "實品顏色以單品照為主",
    story: "你絕對有看過",
    target: 69900,
    accumulate: 60000,
    progress: "(100/1000)*100",
    colors: [
      {
        code: "D4C2A4",
        name: "狗狗黃",
      },
    ],
    sizes: ["F"],
    main_image:
      "https://www.ikea.com.tw/dairyfarm/tw/images/101/0710164_PE727367_S4.webp",
    images: [
      "https://www.ikea.com.tw/dairyfarm/tw/images/768/0876835_PE611246_S4.webp",
      "https://www.ikea.com.tw/dairyfarm/tw/images/331/0933106_PH167496_S4.webp",
    ],
  });
  await initialCreatePreorder.save();

  //   interface OneResponse {
  //     sendTime: Date | null | undefined;
  //     isUser: boolean;
  //     content: string | null | undefined;
  //   }

  //   interface ResponseData {
  //     data: OneResponse[];
  //   }

  //   const response: ResponseData = {
  //     data: [],
  //   };

  //   data.forEach((oneChat) => {
  //     let isUser: boolean = false;
  //     if (oneChat.userType == "user") {
  //       isUser = true;
  //     }
  //     const oneResponse: OneResponse = {
  //       sendTime: oneChat.sendTime,
  //       isUser: isUser,
  //       content: oneChat.content,
  //     };
  //     response.data.push(oneResponse);
  //   });

  //   res.status(200).send(response);
});

export default router;
