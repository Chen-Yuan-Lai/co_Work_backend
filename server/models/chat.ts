import mongoose, { now } from "mongoose";

const chatSchema = new mongoose.Schema({
  sendTime: { type: Date },
  userType: { type: String },
  userId: { type: String },
  content: { type: String },
});

// create a model
const Chat = mongoose.model("Chat", chatSchema); //singular + lower case start

export default Chat;
