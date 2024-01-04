import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

import User from '../models/User'

export const tokenValidator = async (req: Request, res: Response, next: NextFunction) => {
    var token = req.headers["x-access-token"]
    if (!token) res.status(401).json({ message: "Un Auhtorized!" })

    try {
        const decoded: any = jwt.verify(token as string, process.env.SECRET_KEY_AUTH || '')
        const user: any = await User.findById({ id: decoded.user_id }).exec()
        console.log(user)
        if (user.length !== 0 && user.is_verified == true) {
            res.locals.user_id = decoded.user_id;
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader(
                "Access-Control-Allow-Methods",
                "GET, POST, OPTIONS,"
            );
            res.setHeader(
                "Access-Control-Allow-Headers",
                "origin, content-type, accept,x-access-token"
            );
            next()
        } else {
            res.status(401).json({ message: "Un Auhtorized!" })
        }
    } catch (error) {
        console.log(error)
        res.status(501).json({ message: "Something went wrong" })
    }
}