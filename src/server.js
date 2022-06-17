import express from "express";
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";
import flash from "express-flash";
import rootRouter from "./routers/rootRouter.js";
import userRouter from "./routers/userRouter.js";
import videoRouter from "./routers/videoRouter.js";
import { localsMiddleware } from "./middleware .js";

const app = express();
const logger = morgan("dev");

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(flash());
app.use(logger);
app.use(express.urlencoded({ extended: false }));
app.use("/uploads", express.static("uploads"));
app.use("/static", express.static("assets")); //static은 브라우저를 위한 url
app.use(
  session({
    secret: "amdovb8y3i2v23ve",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.DB_URL, //세션을 mognoDB에 저장
    }),
  })
);
app.use(localsMiddleware);

app.use("/", rootRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);

export default app;
