import { Request, Response } from "express"
import { Product } from "../database/entity/Product";
import { ProductRepository } from "../repositories/ProductRepository";

export const createProduct = async (req: Request, res: Response) => {
    try {        
        const product : Product = req.body;
        await ProductRepository.insert(product);
        return res.status(201).send({ isCreated: true, message: "Product created succesfully" });
    }
    catch (error: unknown) {
        console.log(error)
        if (error instanceof Error) {
            return res.status(400).send({ isCreated: false, message: error.message });
        }
        else {
            return res.status(400).send({ isCreated: false, message: "Something went wrong"});
        }
    }
};

export const deleteProduct = async (req: Request, res: Response) => {
    try {        
        const id: number = req.body["id"];
        const product: unknown = await ProductRepository.findOneBy({ id: id });
        if (product instanceof Product) {
            ProductRepository.delete(product.id);
            return res.status(200).send({ isErased: true, message: "Product erased succesfully" });
        }
        else throw Error("The Product don't exists");
    }
    catch (error: unknown) {
        console.log(error);
        if (error instanceof Error) {
            return res.status(400).send({ isErased: false, message: error.message });
        }
        else {
            return res.status(400).send({ isErased: false, message: "Something went wrong"});
        }
    }
};

const removeUndefined = <T extends Product>(product: T, productUpdate: T) => {
    for (let key in product) {
        if (productUpdate[key] == undefined) {
            productUpdate[key] = product[key];
        }
    }
};

export const updateProduct = async (req: Request, res: Response) => {
    try {        
        const productUpdate: Product = req.body;
        const product: unknown = await ProductRepository.findOneBy({ id: productUpdate.id }); 
        if (product instanceof Product) {
            removeUndefined(product, productUpdate);
            ProductRepository.update(product.id, productUpdate);
            return res.status(200).send({ isUpdate: true, user: productUpdate, message: "Product updated succesfully" });
        }
        else throw Error("The user don't exists");
    }
    catch (error: unknown) {
        console.log(error);
        if (error instanceof Error) {
            return res.status(400).send({ isUpdate: false, message: error.message });
        }
        else {
            return res.status(400).send({ isUpdate: false, message: "Something went wrong"});
        }
    }
};

export const findProduct = async (req: Request, res: Response) => {
    try {        
        const id: unknown  = req.query.id;
        if (typeof id == "string") {
            const product: unknown = await ProductRepository.findOneBy({ id: parseInt(id) }); 
            if (product instanceof Product) {
                return res.status(200).send({ product: product});
            }
            else throw Error("The product don't exists");
        }
        else throw Error("Invalid data");
    }
    catch (error: unknown) {
        console.log(error);
        if (error instanceof Error) {
            return res.status(400).send({ message: error.message });
        }
        else {
            return res.status(400).send({ message: "Something went wrong"});
        }
    }
};

export const findProducts = async (req: Request, res: Response) => {
    try {        
        const products: Product[] = await ProductRepository.find(); 
        return res.status(200).send({ products: products});
    }
    catch (error: unknown) {
        console.log(error);
        if (error instanceof Error) {
            return res.status(400).send({ message: error.message });
        }
        else {
            return res.status(400).send({ message: "Something went wrong"});
        }
    }
};