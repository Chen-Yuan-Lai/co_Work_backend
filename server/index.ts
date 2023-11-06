import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import swaggerOutput from "./swagger_output.json" assert { type: "json" };
import swaggerUi from "swagger-ui-express";
import productRouter from "./routes/product.js";
import userRouter from "./routes/user.js";
import campaignRouter from "./routes/campaign.js";
import orderRouter from "./routes/order.js";
import reportRouter from "./routes/report.js";
import chatRouter from "./routes/chathistory.js";
import branch from "./middleware/branch.js";
import authenticate from "./middleware/authenticate.js";
import authorization from "./middleware/authorization.js";
import rateLimiter from "./middleware/rateLimiter.js";
import { errorHandler } from "./utils/errorHandler.js";

//socket io
import { createServer } from "node:http";
import { RemoteSocket, Server, Socket } from "socket.io";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import verifyJWT from "./utils/verifyJWT.js";
import Chat from "./models/chat.js";

dotenv.config();
const app = express();
const port = 3000;

app.use(morgan("dev"));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerOutput));

app.use(cookieParser());

app.use(cors());
app.enable("trust proxy");

app.use(express.json());
const dbConnectString: string = process.env.DBconnect || "";

mongoose
  .connect(dbConnectString)
  .then(() => {
    console.log("Connect to MongoDB Atlas");
  })
  .catch((err) => {
    console.log("Connection Failed.");
    console.log(err);
  });

app.use("/api", rateLimiter, [
  productRouter,
  userRouter,
  campaignRouter,
  orderRouter,
  reportRouter,
  chatRouter,
]);

app.use(
  branch(
    (req) => req.path.includes("/admin"),
    [authenticate, authorization("admin")]
  ),
  express.static("../client")
);

app.use("/uploads", express.static("./uploads"));
app.use("/assets", express.static("./assets"));

app.use(errorHandler);
app.listen(port, () => {
  console.log(`Http listening on port ${port}`);
});

//socket io logic - open port 4000
app.use(cors());
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
let admins: string = "";
let users: string = "";

io.on("connection", (socket) => {
  console.log("Socket-connect");
  socket.on("user-check", async (userIdentify) => {
    // const [role, jwtToken] = userIdentify;
    // const roomUsers = await io.in("admin").fetchSockets();

    type DefaultEventsMap = any;
    const [role, jwtToken]: [string, string] = userIdentify;
    const roomUsers: RemoteSocket<DefaultEventsMap, any>[] = await io
      .in("admin")
      .fetchSockets();
    const room: Set<string> | undefined = io.sockets.adapter.rooms.get("admin");
    let jwterr: string | unknown = "";

    let decoded: {
      userId: number;
    } | null = null;
    try {
      decoded = await verifyJWT(jwtToken);
    } catch (err) {
      jwterr = err;
    }
    console.log(decoded, jwterr);
    console.log(roomUsers.length, role, socket.id);
    console.log(`${role} connected.`);
    console.log(room);
    console.log(users, admins);

    // repeat connection
    if (jwterr) {
      socket.emit("user-check", ["Disconnect", "JWT token error "]);
    } else if (users == socket.id) {
      socket.emit("user-check", ["Connect", "You are already connected."]);
    } else if (admins == socket.id) {
      socket.emit("user-check", ["Connect", "You are already connected."]);

      //  user - room=0 or 2
    } else if (roomUsers.length == 0 && role == "user") {
      socket.emit("user-check", ["Disconnect", "All admin is offline."]);
    } else if (roomUsers.length == 2 && role == "user") {
      socket.emit("user-check", ["Disconnect", "All admin is busy."]);

      // user - room = 1
    } else if (roomUsers.length == 1 && !room?.has(users) && role == "user") {
      socket.join("admin");
      users = socket.id;
      socket.emit("user-check", ["Connect", "user connect"]);
    } else if (roomUsers.length == 1 && room?.has(users) && role == "user") {
      socket.emit("user-check", ["Disconnect", "All admin is busy."]);

      // admin - room = 0
    } else if (roomUsers.length == 0 && role == "admin") {
      socket.join("admin");
      admins = socket.id;
      socket.emit("user-check", ["Connect", "admin connect"]);

      // admin - room = 2
    } else if (roomUsers.length == 2 && role == "admin") {
      socket.emit("user-check", ["Disconnect", "Already one admin in room."]);

      // admin - room = 1 + have admin
    } else if (roomUsers.length == 1 && room?.has(admins) && role == "admin") {
      socket.emit("user-check", ["Disconnect", "Already one admin in room."]);

      // admin - room = 1 + no admin
    } else if (roomUsers.length == 1 && !room?.has(admins) && role == "admin") {
      socket.join("admin");
      admins = socket.id;
      socket.emit("user-check", ["Connect", "admin connect"]);
    } else {
      socket.emit("user-check", [
        "Disconnect",
        "Server Error, Please try again",
      ]);
    }
  });

  socket.on("disconnect", () => {
    console.log("Disconnect:  " + socket.id);
    const room = io.sockets.adapter.rooms.get("admin");
    console.log(room);
    if (users == socket.id) {
      users = "";
    } else {
      admins = "";
    }
  });

  socket.on("talk", async (message, userIdentify) => {
    const room = io.sockets.adapter.rooms.get("admin");
    const [role, jwtToken] = userIdentify;
    console.log(room);

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
      socket.emit("user-check", ["Disconnect", "JWT token error "]);
    } else if (!room) {
      socket.emit("user-check", [
        "Disconnect",
        "Please connect before talking",
      ]);
    } else if (room.has(admins) && room.has(users)) {
      console.log("User and admin start talking.");
      socket.join("admin");

      let userId: number | undefined = decoded?.userId;
      console.log("My jwt user id:" + userId);

      let isUser: boolean = false;
      if (role == "user") {
        isUser = true;
      }

      let sendMessage = {
        sendTime: new Date(),
        isUser: isUser,
        content: message,
      };

      socket.to("admin").emit("talk", sendMessage);

      let singleMessage = {
        sendTime: new Date(),
        userType: role,
        userId: userId,
        content: message,
      };
      // console.log(singleMessage);

      const saveMessage = new Chat({
        sendTime: new Date(),
        userType: role,
        userId: userId,
        content: message,
      });

      await saveMessage.save();
    } else if (room.has(admins)) {
      socket.emit("user-check", [
        "Connect",
        "admin still connect, user disconnect",
      ]);
      users = "";
    } else if (room.has(users)) {
      type DefaultEventsMap = /*unresolved*/ any;
      const userSocket:
        | Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
        | undefined = io.sockets.sockets.get(users);
      userSocket?.emit("user-check", ["Disconnect", "Admin left the room"]);
      userSocket?.leave("admin");
      users = "";
      admins = "";
    }
  });

  socket.on("user-close", async () => {
    const userSocket = io.sockets.sockets.get(users);
    if (!userSocket) {
      socket.emit("user-check", ["Disconnect", "User is removed from room"]);
    } else {
      userSocket.emit("user-check", [
        "Disconnect",
        "User is removed from room",
      ]);
      userSocket.leave("admin");
      users = "";
    }
  });
});

server.listen(4000, () => {
  console.log(`Socket listening on port 4000`);
});
