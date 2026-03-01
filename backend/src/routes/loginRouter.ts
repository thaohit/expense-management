import { Router } from "express";
import { login } from "../controllers/loginController";

export const loginRouter = Router();

// POST ならControllerのloginを呼び出す 
loginRouter.post("/", login);

