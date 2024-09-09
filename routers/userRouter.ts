import express from "express";
import { create, erase, find, update } from "../controllers/UserController";

export const userRouter = express.Router();

userRouter.post("/", create);
userRouter.delete("/", erase);
userRouter.put("/", update);
userRouter.get("/", find);