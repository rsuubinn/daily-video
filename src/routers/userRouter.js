import express from "express";
import {
  finishGithubLogin,
  logout,
  startGithubLogin,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/logout", logout);
userRouter.get("/github/start", startGithubLogin);
userRouter.get("/github/finish", finishGithubLogin);

export default userRouter;
