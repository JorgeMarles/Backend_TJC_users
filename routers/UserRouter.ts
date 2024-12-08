import express from "express";
import { create, disable, find, update } from "../controllers/UserController";
import { authenticate } from "../services/SessionService";

export const userRouter = express.Router();

userRouter.post("/", create);
userRouter.delete("/", authenticate(['admin']), disable);
userRouter.put("/", authenticate(['admin']), update);
userRouter.get("/", authenticate(['admin']), find);
//userRouter.get("/all", get_all);
//userRouter.get("/:id", );
