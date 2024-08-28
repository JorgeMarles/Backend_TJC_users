import express from "express";
import { register } from "../controllers/usuarioController";

export const userRouter = express.Router();

userRouter.post("/register", register);