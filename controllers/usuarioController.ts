import { Request, Response } from "express"
import { createUser } from "../services/userService"

export const register = async (req: Request, res : Response) => {
    try {
        createUser(req, res);
    }
    catch (error) {
        console.error(error);
        if (error instanceof Error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}