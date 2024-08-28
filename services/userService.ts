import { Request, Response } from "express"
import { AppDataSource } from "../database";
import { User } from "../database/models/User";

const userRepository = AppDataSource.getRepository(User);

export const createUser = async (req: Request, res : Response) => {
    try {        
        const user : User = req.body;
        userRepository.save(user);
        return res.status(200).send('User created');
    }
    catch (error) {
        console.log(error)
        return res.status(400).send({ message: "something went wrong" });
    }
};