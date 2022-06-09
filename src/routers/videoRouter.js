import express from "express";
import { videoUpload } from "../middleware .js";
import {
  getUpload,
  postUpload,
  watch,
} from "../controllers/videoController.js";

const videoRouter = express.Router();

videoRouter.get("/:id([0-9a-f]{24})", watch);

videoRouter
  .route("/upload")
  .get(getUpload)
  .post(videoUpload.single("video"), postUpload);

export default videoRouter;
