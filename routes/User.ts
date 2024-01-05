import * as dotenv from "dotenv";
dotenv.config();
import { Router, Request, Response } from 'express';

import { tokenValidator } from '../middleware/tokenValidator'
import User from '../models/User';
import Post from "../models/Post";
import Notification from "../models/Notifications"

const user = Router();
user.use(tokenValidator);

/* GET USER PROFILE */
user.get("/", async (req: Request, res: Response) => {
    const id = res.locals.user_id;
    if (!id) res.status(401).json({ message: "Some parameters are missing" })
    try {
        const user: any = await User.findById({ _id: id }).select('-password -otp -__v -is_verified').exec()
        user.length !== 0
            ? res.status(201).json(user)
            : res.status(404).json({ message: "User not found!" })
    } catch (error) {
        console.log(error)
        res.status(501).json({ message: "Something went wrong!" })
    }
})

/* UPDATE USER PROFILE */
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

/* GET ALL USER POSTS */
user.get("/posts", async (req: Request, res: Response) => {
    const id = res.locals.user_id
    try {
        const posts = await Post.find({ user: id })
        posts.length !== 0
            ? res.status(200).json(posts)
            : res.status(404).json({ message: "No posts found!" })
    } catch (error) {
        console.log(error)
        res.status(501).json({ message: "Something went wrong!" })
    }
})

/* CREATE A NEW POST */
user.post("/post", async (req: Request, res: Response) => {
    const id = res.locals.user_id
    const { post_type, description, location, img, video } = req.body;
    try {
        const post = new Post({ post_type, user: id, description, location, img, video })
        await post.save()
        res.status(201).json({ message: "Post created successfully" })
    } catch (error) {
        console.log(error)
        res.status(501).json({ message: "Something went wrong!" })
    }
})

/* GET USER NOTIFICATIONS */
user.get("/notifications", async (req: Request, res: Response) => {
    const id = res.locals.user_id
    try {
        const notifications = await Notification.find({ user: id })
        notifications.length !== 0
            ? res.status(200).json(notifications)
            : res.status(404).json({ message: "No notifications at the moment!" })
    } catch (error) {
        console.log(error)
        res.status(501).json({ message: "Something went wrong!" })
    }
})

export default user;