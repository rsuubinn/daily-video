import multer from "multer";

export const localsMiddleware = (req, res, next) => {
  console.log(req.session);
  res.locals.siteName = "Daily Video";
  res.locals.loggedIn = req.session.loggedIn;
  res.locals.loggedInUser = req.session.user || {};
  next();
};

export const videoUpload = multer({
  dest: "uploads/videos",
});
