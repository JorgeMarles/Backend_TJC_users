import { Request, Response } from "express";
import { User } from "../database/entity/User";
import nodemailer, { Transporter } from 'nodemailer';
import { UserRepository } from "../repositories/UserRepository";
import { SMTP_PWD, SMTP_USER } from "../config";
import crypto from 'crypto';
import { emailTemplate } from "../utils/htmlRecoveryCode";

const transporter: Transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: SMTP_USER,
        pass: SMTP_PWD,
    },
});

const recoveryCodes = new Map();

const createRecoveryCode = (email: string) => {
    const code = crypto.randomInt(100000, 999999);
    recoveryCodes.set(email, { code, expiresAt: Date.now() + 10 * 60 * 1000 });
    return code;
}

export const sendEmail = async (req: Request, res: Response) => {
    try {
        const email: unknown = req.body.email;
        if (!(typeof email == "string")) {
            throw new Error("Invalid input: User email is missing or undefined. Please ensure that the email address is provided and try again.");
        }
        const user: unknown = await UserRepository.findOneBy({ email: email });
        if (!(user instanceof User)) {
            throw Error("The user doesn't exists");
        }

        const code = createRecoveryCode(email);
        const html = emailTemplate(code);

        const mailOptions = {
            from: `"Soporte" <${SMTP_USER}>`,
            to: email,
            subject: "Verification code",
            html: html,
        };
        const info = await transporter.sendMail(mailOptions);
        return res.status(200).json({ success: true, messageId: info.messageId });
    }
    catch (error: unknown) {
        console.log(error)
        if (error instanceof Error) {
            return res.status(400).send({ isSend: false, message: error.message });
        }
        else {
            return res.status(400).send({ isSend: false, message: "Something went wrong" });
        }
    }
};

export const validateCode = async (req: Request, res: Response) => {
    try {
        const email: unknown = req.body.email;
        if (!(typeof email == "string")) {
            throw new Error("Invalid input: User email is missing or undefined. Please ensure that the email address is provided and try again.");
        }
        const code: unknown = req.body.code;
        if (!(typeof code == "string")) {
            throw new Error("Invalid input: Recovery code is missing or undefined. Please ensure that the code is provided and try again.");
        }
        const record = recoveryCodes.get(email);
        if (!record || record.expiresAt < Date.now()) {
            recoveryCodes.delete(email);
            throw new Error("The code has expired or is invalid.");
        }
        if (record.code !== parseInt(code, 10)) {
            throw new Error("The code is invalid.");
        }
        return { valid: true };

    }
    catch (error: unknown) {
        console.log(error)
        if (error instanceof Error) {
            return res.status(400).send({ isSend: false, message: error.message });
        }
        else {
            return res.status(400).send({ isSend: false, message: "Something went wrong" });
        }
    }
};
