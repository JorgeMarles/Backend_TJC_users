import { Request, Response } from "express"
import { User } from "../database/entity/User";
import { UserRepository } from "../repositories/UserRepository";
import bcrypt from "bcrypt";

export const createUser = async (req: Request, res: Response) => {
    try {        
        const user : User = req.body;
        const salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash(user.password, salt); 
        user.type = false;
        user.disable = false;
        await UserRepository.insert(user);
        return res.status(201).send({ isCreated: true, message: "User created succesfully" });
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

export const disableUser = async (req: Request, res: Response) => {
    try {        
        const email: string = req.body["email"];
        const user: unknown = await UserRepository.findOneBy({ email: email });
        if (user instanceof User) {
            UserRepository.delete(user.id);
            return res.status(200).send({ isErased: true, message: "User disabled succesfully" });
        }
        else throw Error("The user don't exists");
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

const removeUndefined = <T extends User>(user: T, userUpdate: T) => {
    for (let key in user) {
        if (userUpdate[key] == undefined) {
            userUpdate[key] = user[key];
        }
    }
};

export const updateUser = async (req: Request, res: Response) => {
    try {        
        const userUpdate: User = req.body;
        const user: unknown = await UserRepository.findOneBy({ email: userUpdate.email }); 
        if (user instanceof User) {
            removeUndefined(user, userUpdate);
            UserRepository.update(user.id, userUpdate);
            return res.status(200).send({ isUpdate: true, message: "User updated succesfully" });
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

export const updateUserPassword = async (req: Request, res: Response) => {
    try {        
        const email: unknown = req.body.email;
        if (!(typeof email == "string")) {
            throw new Error("Invalid input: User email is missing or undefined. Please ensure that the email address is provided and try again.");
        }
        const password: unknown = req.body.password;
        if (!(typeof password == "string")) {
            throw new Error("Invalid input: User new password is missing or undefined. Please ensure that the new password is provided and try again.");
        }
        const user: unknown = await UserRepository.findOneBy({ email: email }); 
        if (!(user instanceof User)) {
            throw Error("The user doesn't exists");
        }
        const userUpdate: User = user;
        const salt = await bcrypt.genSalt();
        userUpdate.password = await bcrypt.hash(password, salt);
        UserRepository.update(user.id, userUpdate);

        return res.status(200).send({ isUpdate: true, message: "User updated succesfully" });
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

export const findUser = async (req: Request, res: Response) => {
    try {        
        const email: unknown  = req.query.email;
        if (typeof email == "string") {
            const user: unknown = await UserRepository.findOneBy({ email: email }); 
            if (user instanceof User) {
                return res.status(200).send({ user: user});
            }
            else throw Error("The user don't exists");
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

export const findUsers = async (req: Request, res: Response) => {
    try {        
        const users: User[] = await UserRepository.find(); 
        return res.status(200).send({ users: users});
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
