import { NextFunction, Request, Response } from "express"
import { UserRepository } from "../repositories/UserRepository";
import { User } from "../database/entity/User";
import jwt from "jsonwebtoken";
import crypto  from "crypto"
import bcrypt from "bcrypt";

const SECRET_KEY = crypto.randomBytes(64).toString('hex');

interface Credentials {
    email: string;
    password: string;
};

export const login = async (req: Request, res: Response) => {
    try {        
        const credentials: Credentials  = req.body;
        const user: unknown = await UserRepository.findOneBy({ email: credentials.email });
        if (user instanceof User) {
            const passwordMatched = await bcrypt.compare(credentials.password, user.password);
            if (passwordMatched) {
                const token = jwt.sign( { email: credentials.email, type: user.type } , SECRET_KEY, { expiresIn: "1h" });
                return res.status(200).json({ token });
            }
            else throw Error("The password is incorrect");
        } 
        else throw Error("The user don't exists");
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

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const header = req.header("Authorization") || "";
    const token = header.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token not provied" });
    }
    try {
      const payload = jwt.verify(token, SECRET_KEY);
      next();
    } catch (error) {
      return res.status(403).json({ message: "Token not valid" });
    }
}; 