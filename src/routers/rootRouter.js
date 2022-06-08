import express from "express";
import { join, login } from "../controllers/userController.js";
import { home, search } from "../controllers/videoController.js";

const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter.get("/login", login);
rootRouter.get("/join", join);
rootRouter.get("/search", search);

export default rootRouter;
