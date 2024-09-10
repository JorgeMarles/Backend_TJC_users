import { Request, Response } from "express";
import { createProduct, deleteProduct, findProduct, findProducts, updateProduct } from "../services/ProductService";

export const create = async (req: Request, res : Response) => {
    try {
        createProduct(req, res);
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
        deleteProduct(req, res);
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
        updateProduct(req, res);
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
            findProduct(req, res);
        }
        else {
            findProducts(req, res);
        }
    }
    catch (error) {
        console.error(error);
        if (error instanceof Error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
};


