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
app.use("/uploads", express.static("uploads"));
app.use(
  session({
    secret: "amdovb8y3i2v23ve",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(localsMiddleware);

// app.use((req, res, next) => {
//   req.sessionStore.all((error, sessions) => {
//     console.log(sessions);
//     next();
//   });
// });

app.use("/", rootRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);

app.listen(PORT, handleListening);
