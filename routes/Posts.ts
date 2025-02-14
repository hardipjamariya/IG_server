import * as dotenv from "dotenv";
dotenv.config();
import { Router, Request, Response } from 'express';

import User from '../models/User';
import Post from '../models/Post';

const post = Router();

/*
 TODO : 
 -> GET 10 posts in number on every api call based on recent timeline.
 -> Set 5 hr timelimit from the time the api is called, and fetch the posts.
 -> If no posts found within 5 hr limit, generate random and label them as suggested
*/
post.get("/feed", async (req: Request, res: Response) => {

})

/*
 TODO : 
 -> GET 20 posts in number on every api call.
 -> Generate random data using Faker Library. 
*/
post.get("/explore", async (req: Request, res: Response) => {

})


export default post
