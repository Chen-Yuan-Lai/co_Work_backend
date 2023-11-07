import express from "express";
const router = express.Router();
const app = express();
import Chat from "../models/chat.js";

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

//middleware
router.use(function (req, res, next) {
  console.log("A request go to apiroute");
  next();
});

router.post("/chat/history", async (req, res) => {
  console.log("A request came to chat history API");
  const userId: string = req.body.userId;

  let data = await Chat.find({ userId: userId });

  interface OneResponse {
    sendTime: Date | null | undefined;
    isUser: boolean;
    content: string | null | undefined;
  }

  interface ResponseData {
    data: OneResponse[];
  }

  const response: ResponseData = {
    data: [],
  };

  data.forEach((oneChat) => {
    let isUser: boolean = false;
    if (oneChat.userType == "user") {
      isUser = true;
    }
    const oneResponse: OneResponse = {
      sendTime: oneChat.sendTime,
      isUser: isUser,
      content: oneChat.content,
    };
    response.data.push(oneResponse);
  });

  res.status(200).send(response);
});

export default router;
