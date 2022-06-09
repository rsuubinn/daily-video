import "./db.js";
import express from "express";
import session from "express-session";
import rootRouter from "./routers/rootRouter.js";
import userRouter from "./routers/userRouter.js";
import videoRouter from "./routers/videoRouter.js";
import { localsMiddleware } from "./middleware .js";

const app = express();
const PORT = 4000;

const handleListening = () => {
  console.log(`Server is listening http://localhost:${PORT}`);
};

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");

app.use(express.urlencoded({ extended: false }));
app.use(localsMiddleware);
app.use("/uploads", express.static("uploads"));

app.use("/", rootRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);

app.listen(PORT, handleListening);
