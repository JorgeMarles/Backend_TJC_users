import express from "express";
import { create, erase, find, update } from "../controllers/ProductController";

export const productRouter = express.Router();

productRouter.post("/", create);
productRouter.delete("/", erase);
productRouter.put("/", update);
productRouter.get("/", find);