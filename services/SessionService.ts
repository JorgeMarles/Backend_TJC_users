import { NextFunction, Request, Response } from "express"
import { UserRepository } from "../repositories/UserRepository";
import { User } from "../database/entity/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import fs from 'fs';
import { URL_PRIVATE_KEY, URL_PUBLIC_KEY } from "../config";

// const SECRET_KEY = crypto.randomBytes(64).toString('hex');
const PRIVATE_KEY = fs.readFileSync(URL_PRIVATE_KEY, "utf8");
export const PUBLIC_KEY = fs.readFileSync(URL_PUBLIC_KEY, "utf8");

interface Credentials {
    email: string;
    password: string;
};

export interface TokenPayload {
    email: string;
    type: string;
    exp: number;
}

interface CustomRequest extends Request {
    user?: { email: string; type: string };
  }

export const login = async (req: Request, res: Response) => {
    try {
        const credentials: Credentials = req.body;
        const user: unknown = await UserRepository.findOneBy({ email: credentials.email });
        if (user instanceof User) {
            const passwordMatched = await bcrypt.compare(credentials.password, user.password);
            if (passwordMatched) {
                const type = user.type ? "admin" : "user";
                const token = jwt.sign({ email: credentials.email, type: type, nickname: user.nickname }, PRIVATE_KEY, { algorithm: "RS256", expiresIn: "1h" });
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
            return res.status(400).send({ message: "Something went wrong" });
        }
    }
};

export const authenticate = (roles: string[]) => {
    return async (req: CustomRequest, res: Response, next: NextFunction) => {
      const header = req.header("Authorization");
      if (!header) {
        return res.status(401).json({ message: "Authorization header missing" });
      }
  
      const token = header.split(" ")[1];
      if (!token) {
        return res.status(401).json({ message: "Token not provided" });
      }
  
      try {
        const payload = jwt.verify(token, PUBLIC_KEY, { algorithms: ["RS256"] }) as TokenPayload;
        req.user = payload;
        if (!roles.includes(payload.type)) {
          return res.status(403).json({ message: "Access denied" });
        }
  
        next();
      } catch (error) {
        return res.status(403).json({ message: "Invalid or expired token" });
      }
    };
  };