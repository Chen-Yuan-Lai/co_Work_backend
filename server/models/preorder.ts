import mongoose, { now } from "mongoose";

const preorderSchema = new mongoose.Schema({
  id: { type: Number },
  category: { type: String },
  title: { type: String },
  desciption: { type: String },
  price: { type: Number },
  texture: { type: String },
  wash: { type: String },
  place: { type: String },
  note: { type: String },
  story: { type: String },
  target: { type: Number },
  accumulate: { type: Number },
  colors: [
    {
      code: { type: String },
      name: { type: String },
    },
  ],
  sizes: [{ type: String }],
  main_image: { type: String },
  images: [{ type: String }],
});

// create a model
const Preorder = mongoose.model("Preorder", preorderSchema); //singular + lower case start

export default Preorder;
