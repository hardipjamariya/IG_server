import * as dotenv from "dotenv";
dotenv.config();
import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import { generateOTP } from "../utility/otp";
import User from '../models/User';

const saltRounds = 10;
const auth = Router();

auth.post("/login", async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) res.status(401).json({ message: "Some parameters are missing" })
    try {
        const user: any = await User.find({ email }).exec();
        if (user && user.password === password) {
            const token = jwt.sign(
                { user_id: user._id, time: new Date().getTime() },
                process.env.SECRET_KEY_AUTH || '',
                { expiresIn: '1d' }
            );
            res.status(201).json({ token: token })
        } else {
            res.status(404).json({ message: "User not found" })
        }
    } catch (error) {
        console.log(error)
        res.status(501).json({ message: "Something went wrong" })
    }
})

auth.post("/register", async (req: Request, res: Response) => {
    const { email, name, username, password } = req.body;
    if (!email || !name || !username || !password) res.status(401).json({ message: "Some parameters are missing" })
    try {
        const user: any = await User.find({ email }).exec();
        if (!user || !user.is_verfied) {
            const otp = generateOTP();
            const newUser = new User({ email, name, username, password, otp })
            await newUser.save()
            res.status(201).json({ message: "Verification code has been shared" })
        } else {
            res.status(404).json({ message: "Email already in use" })
        }
    } catch (error) {
        console.log(error)
        res.status(501).json({ message: "Something went wrong" })
    }
})

auth.post("/verify", async (req: Request, res: Response) => {
    const { email, otp } = req.body;
    if (!email || !otp) res.status(401).json({ message: "Some parameters are missing" })
    try {
        const user: any = await User.find({ email }).exec();
        if (user && user.otp === otp) {
            const updateUser = await User.findOneAndUpdate({ email: email }, { $set: { is_verified: true } }, { new: true }).exec()
            const token = jwt.sign(
                { user_id: user._id, time: new Date().getTime() },
                process.env.SECRET_KEY_AUTH || '',
                { expiresIn: '1d' }
            );
            res.status(201).json({ token: token })
        } else {
            res.status(201).json({ message: "Invalid OTP" })
        }
    } catch (error) {
        console.log(error)
        res.status(501).json({ message: "Something went wrong" })
    }
})

export default auth;