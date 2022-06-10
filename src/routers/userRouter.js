import express from "express";
import { logout } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/logout", logout);

export default userRouter;
