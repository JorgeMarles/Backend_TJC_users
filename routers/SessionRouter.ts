import express from "express";
import { loginUser } from "../controllers/SessionController";

export const sessionRouter = express.Router();

sessionRouter.post("/login", loginUser);
//sessionRouter.post("/logout", );