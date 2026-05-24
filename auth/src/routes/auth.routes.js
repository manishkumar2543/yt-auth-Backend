import { Router } from "express";
import { register, getMe } from "../controllers/auth.controller.js";

const authRouter = Router();


authRouter.post('/register', register);
authRouter.get('/get-me', getMe);

export default authRouter