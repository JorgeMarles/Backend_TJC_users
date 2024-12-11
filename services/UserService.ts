import { Request, Response } from "express"
import { User } from "../database/entity/User";
import { UserRepository } from "../repositories/UserRepository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PUBLIC_KEY, TokenPayload } from "./SessionService";
import axios from "axios";
import { URL_BACKEND_PROBLEM } from "../config";


export const createUser = async (req: Request, res: Response) => {
    try {
        const user: User = req.body;
        const salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash(user.password, salt);
        user.type = false;
        user.disable = false;
        const newUser = await UserRepository.save(user);
        
        const response = await axios.post(`${URL_BACKEND_PROBLEM}/user`, {id: newUser.id});
        if(response.status != 201) {
            UserRepository.delete(newUser.id);
            throw Error(`Error creating user`);
        }

        return res.status(201).send({ isCreated: true, message: "User created succesfully" });
    }
    catch (error: unknown) {
        console.log(error)
        if (error instanceof Error) {
            return res.status(400).send({ isCreated: false, message: error.message });
        }
        else {
            return res.status(400).send({ isCreated: false, message: "Something went wrong" });
        }
    }
};

export const createUserAdmin = async (req: Request, res: Response) => {
    try {
        const user: User = req.body;
        const salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash(user.password, salt);
        user.type = true;
        user.disable = false;
        const newUser = await UserRepository.save(user);

        const response = await axios.post(`${URL_BACKEND_PROBLEM}/user`, {id: newUser.id});
        if(response.status != 201) {
            UserRepository.delete(newUser.id);
            throw Error(`Error creating user`);
        }

        return res.status(201).send({ isCreated: true, message: "Admin created succesfully" });
    }
    catch (error: unknown) {
        console.log(error)
        if (error instanceof Error) {
            return res.status(400).send({ isCreated: false, message: error.message });
        }
        else {
            return res.status(400).send({ isCreated: false, message: "Something went wrong" });
        }
    }
};

export const disableUser = async (req: Request, res: Response) => {
    try {
        const email: string = req.body["email"];
        const user: unknown = await UserRepository.findOneBy({ email: email });
        if (user instanceof User) {
            user.disable = true;
            UserRepository.update(user.id, user);
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
            return res.status(400).send({ isErased: false, message: "Something went wrong" });
        }
    }
};

const removeUndefined = <T extends User>(user: T, userUpdate: T) => {
    const cleanUser: T = { ...userUpdate } as T;

    for (let key in user) {
        if (userUpdate[key as keyof T] === undefined) {
            cleanUser[key as keyof T] = user[key];
        }
    }

    for (let key in cleanUser) {
        if (!(key in user)) {
            delete cleanUser[key as keyof T];
        }
    }

    return cleanUser;
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        const userUpdate: User = req.body;
        const user: unknown = await UserRepository.findOneBy({ id: userUpdate.id });
        if (!(user instanceof User)) {
            throw Error("The user doesn't exists");
        }
        const salt = await bcrypt.genSalt();

        const header = req.header("Authorization") || "";
        const token = header.split(" ")[1];
        const payload = jwt.verify(token, PUBLIC_KEY, { algorithms: ["RS256"] }) as TokenPayload;
        const userOwn: unknown = await UserRepository.findOneBy({ email: payload.email });
        let access = false;
        if ((userOwn instanceof User) && userOwn.id === userUpdate.id) {
            const passwordMatched = await bcrypt.compare(userUpdate.password, user.password);
            if (passwordMatched) {
                userUpdate.password = user.password;
                userUpdate.type = userOwn.type;
                access = true;
            }
        }
        else if (payload.type === "admin") {
            access = true;
        }
        if (access) {
            if ("newPassword" in userUpdate && typeof userUpdate.newPassword == "string") {
                userUpdate.password = await bcrypt.hash(userUpdate.newPassword, salt);
            }
            const cleanUser = removeUndefined(user, userUpdate);
            UserRepository.update(user.id, cleanUser);
            return res.status(200).send({ isUpdate: true, message: "User updated succesfully" });
        }
        throw Error("Access denied");
    }
    catch (error: unknown) {
        console.log(error);
        if (error instanceof Error) {
            return res.status(400).send({ isUpdate: false, message: error.message });
        }
        else {
            return res.status(400).send({ isUpdate: false, message: "Something went wrong" });
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
            return res.status(400).send({ isUpdate: false, message: "Something went wrong" });
        }
    }
};

export const findUser = async (req: Request, res: Response) => {
    try {
        const email: unknown = req.query.email;
        const id: unknown = req.query.id;
        if (!(typeof email == "string") && !(typeof id == "string")) {
            throw Error("Invalid data");
        }
        let user: unknown;
        if(typeof email == "string") {
            user = await UserRepository.findOneBy({ email: email });
        }
        else if(typeof id == "string"){
            user = await UserRepository.findOneBy({ id: parseInt(id) });
        }
        if (!(user instanceof User)) {
            throw Error("The user doesn't exists");
        }
        const header = req.header("Authorization") || "";
        const token = header.split(" ")[1];
        const payload = jwt.verify(token, PUBLIC_KEY, { algorithms: ["RS256"] }) as TokenPayload;
        if (payload.email === user.email || payload.type === "admin") {
            return res.status(200).send({ user: user });
        }
        throw Error("Access denied");
    }
    catch (error: unknown) {
        console.log(error);
        if (error instanceof Error) {
            return res.status(400).send({ message: error.message });
        }
        else {
            return res.status(400).send({ message: "Something went wrong" });
        }
    }
};

export const findUsers = async (req: Request, res: Response) => {
    try {
        const users: User[] = await UserRepository.find({ where: { type: false, disable: false } });
        return res.status(200).send({ users: users });
    }
    catch (error: unknown) {
        console.log(error);
        if (error instanceof Error) {
            return res.status(400).send({ message: error.message });
        }
        else {
            return res.status(400).send({ message: "Something went wrong" });
        }
    }
};
