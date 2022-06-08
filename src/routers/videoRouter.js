import express from "express";
import { videoUpload } from "../middleware .js";
import { getUpload, postUpload } from "../controllers/videoController.js";

const videoRouter = express.Router();

// videoRouter.get("/:id([0-9a-f]{24}");

videoRouter
  .route("/upload")
  .get(getUpload)
  .post(videoUpload.single("video"), postUpload);

export default videoRouter;
