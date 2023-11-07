import express from "express";
const router = express.Router();
const app = express();
import Chat from "../models/chat.js";
import verifyJWT from "../utils/verifyJWT.js";

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

//middleware
router.use(function (req, res, next) {
  console.log("A request go to apiroute");
  next();
});

router.post("/user/chat/history", async (req, res) => {
  console.log("A request came to chat history API");
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

  //1. check jwtToken exist
  const jwtToken: string = req.body.jwtToken;
  if (!jwtToken) {
    return res
      .status(400)
      .json("Bad Request: Please provide correct JWT token.");
  }

  //2. verify  jwtToken
  let jwterr: string | unknown = "";
  let decoded: {
    userId: number;
  } | null = null;
  try {
    decoded = await verifyJWT(jwtToken);
  } catch (err) {
    jwterr = err;
  }

  if (jwterr) {
    return res
      .status(400)
      .json("Bad Request: Please provide correct JWT token.");
  }

  //3. verify user id
  let userId: number | undefined = decoded?.userId;
  console.log(userId);
  if (!userId) {
    return res
      .status(400)
      .json("Bad Request: Please provide correct JWT token.");
  }
  //4. get data from MongoDb
  let data = await Chat.find({ userId: userId });

  //5. data prepare and send
  data.forEach((oneChat) => {
    let isUser: boolean = false;
    if (oneChat.userType == "user") {
      isUser = true;
    } else if (oneChat.userType == "admin") {
      isUser = false;
    }

    const oneResponse: OneResponse = {
      sendTime: oneChat.sendTime,
      isUser: isUser,
      content: oneChat.content,
    };
    response.data.push(oneResponse);
  });

  res.status(200).json(response);
});

export default router;
