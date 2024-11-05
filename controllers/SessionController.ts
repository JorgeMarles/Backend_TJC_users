import { Request, Response } from "express";
import { login } from "../services/SessionService"

export const loginUser = async (req: Request, res: Response) => {
    try {
        login(req, res);
    } catch (error) {
        console.error(error);
        if (error instanceof Error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
};