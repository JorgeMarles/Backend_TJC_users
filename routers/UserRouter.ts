import express from "express";
import { create, disable, find, update, sendCode, updatePassword, findOne } from "../controllers/UserController";
import { authenticate } from "../services/SessionService";

export const userRouter = express.Router();

userRouter.post("/", create);
userRouter.post("/sendCode", sendCode);
userRouter.put("/recoveryPassword", updatePassword);
userRouter.delete("/", authenticate(['admin']), disable);
userRouter.put("/", authenticate(['admin', 'user']), update);
userRouter.get("/findOne", authenticate(['admin', 'user']), findOne);
userRouter.get("/", authenticate(['admin']), find);
