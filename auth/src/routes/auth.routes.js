import { Router } from "express";
import { register, getMe, refreshToken} from "../controllers/auth.controller.js";

const authRouter = Router();


authRouter.post('/register', register);
authRouter.get('/get-me', getMe);
authRouter.get('/refresh-token', refreshToken);

export default authRouter