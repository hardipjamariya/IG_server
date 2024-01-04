import * as dotenv from "dotenv";
dotenv.config();
import { Router, Request, Response } from 'express';

import { tokenValidator } from '../middleware/tokenValidator'
import User from '../models/User';
import Post from "../models/Post";

const user = Router();
user.use(tokenValidator);

user.get("/", async (req: Request, res: Response) => {
    const id = res.locals.user_id;
    if (!id) res.status(401).json({ message: "Some parameters are missing" })
    try {
        const user: any = await User.findById({ _id: id }).select('-password -otp -__v -is_verified').exec()
        if (user.length !== 0) {
            res.status(201).json(user)
        } else {
            res.status(404).json({ message: "User not found!" })
        }
    } catch (error) {
        console.log(error)
        res.status(501).json({ message: "Something went wrong!" })
    }
})

user.post("/", async (req: Request, res: Response) => {
    const id = res.locals.user_id;
    const { name } = req.body;
    if (!id) res.status(401).json({ message: "Some parameters are missing" })
    try {
        const user: any = await User.findByIdAndUpdate(id, { name: name }, { new: true }).exec()
        res.status(201).json({ message: "User has been updated" })
    } catch (error) {
        console.log(error)
        res.status(501).json({ message: "Something went wrong!" })
    }
})

user.get("/posts", async (req: Request, res: Response) => {
    const id = res.locals.user_id
    try {
        const posts = await Post.find({ user: id })
        if (posts.length !== 0) {
            res.status(201).json(posts);
        } else {
            res.status(404).json({ message: "No posts found!" })
        }
    } catch (error) {
        console.log(error)
        res.status(501).json({ message: "Something went wrong!" })
    }
})


export default user;