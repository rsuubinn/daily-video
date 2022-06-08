import multer from "multer";

export const localsMiddleware = (req, res, next) => {
  res.locals.siteName = "Daily Video";
  next();
};

export const videoUpload = multer({
  dest: "uploads/videos",
});
