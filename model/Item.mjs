import mongoose from "mongoose";
const { Schema } = mongoose


const ItemSchema = new Schema({
  title: String,
  link: String
});

export default ItemSchema
