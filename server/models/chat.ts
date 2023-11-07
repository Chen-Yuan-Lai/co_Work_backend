import mongoose, { now } from "mongoose";

const chatSchema = new mongoose.Schema({
  sendTime: { type: Date },
  userType: { type: String },
  userId: { type: String },
  content: { type: String },
});

// create a model
const Chat = mongoose.model("Chat", chatSchema); //singular + lower case start

// Chat.deleteMany()
//   .then(function () {
//     console.log("Data deleted"); // Success
//   })
//   .catch(function (error) {
//     console.log(error); // Failure
//   });

export default Chat;
