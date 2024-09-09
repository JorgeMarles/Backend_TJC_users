import { Request, Response } from "express";
import { createUser, deleteUser, findUser, findUsers, updateUser } from "../services/UserService";

export const create = async (req: Request, res : Response) => {
    try {
        createUser(req, res);
    }
    catch (error) {
        console.error(error);
        if (error instanceof Error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
};

export const erase = async (req: Request, res : Response) => {
    try {
        deleteUser(req, res);
    }
    catch (error) {
        console.error(error);
        if (error instanceof Error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
};

export const update = async (req: Request, res : Response) => {
    try {
        updateUser(req, res);
    }
    catch (error) {
        console.error(error);
        if (error instanceof Error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
};

export const find = async (req: Request, res : Response) => {
    try {
        if (req.query["email"] != undefined) {
            findUser(req, res);
        }
        else {
            findUsers(req, res);
        }
    }
    catch (error) {
        console.error(error);
        if (error instanceof Error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
};
