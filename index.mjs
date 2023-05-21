import express from "express";
import bp from "body-parser";
import morgan from "morgan";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from 'dotenv'
import ItemSchema from "./model/Item.mjs";
dotenv.config()
const PORT = process.env.PORT || 8000

mongoose.set("strictQuery", false);

const app = express();

app.use(bp.urlencoded({ extended: true }));
app.use(bp.json());
app.use(morgan("dev"));
app.use(cors({ origin: true }));

const Item = mongoose.model("item", ItemSchema);

app.post("/new", (req, res) => {
  const newItem = new Item({
    title: req.body.title,
    link: req.body.link,
  });

  newItem.save();
  res.json(newItem);
});

app.post("/delete", async (req, res) => {
  const deletedObject = await Item.deleteMany({ title: req.body.title });

  res.json(deletedObject);
});

app.get("/items", async (_req, res) => {
  const items = await Item.find({});

  res.json(items);
});

app.get("/search/", async (req, res) => {
  try {
    const items = await Item.find({
      $text: { $search: req.query.text },
    });

    res.json(items);
  } catch (error) {
    res.json({ error: error.toString() });
  }
});

const start = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://nuxnux:wawa02290@recipe.jqy4drr.mongodb.net/?retryWrites=true&w=majority"
    );
    await Item.init();
    app.listen(PORT, () => {
      console.log(`Server will be ready on ${PORT}`);
    });
  } catch (e) {
    console.log(e.message);
  }
};

start();
