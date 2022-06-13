import multer from "multer";

export const localsMiddleware = (req, res, next) => {
  res.locals.siteName = "Daily Video";
  res.locals.loggedIn = req.session.loggedIn;
  res.locals.loggedInUser = req.session.user || {};
  next();
};

export const protectorMiddleware = (req, res, next) => {
  if (req.session.user) {
    return next();
  } else {
    req.flash("error", "로그인이 필요합니다.");
    return res.redirect("/login");
  }
};

export const publicOnlyMiddleware = (req, res, next) => {
  if (!req.session.user) {
    return next();
  } else {
    req.flash("error", "권한이 없습니다.");
    return res.redirect("/");
  }
};

export const videoUpload = multer({
  dest: "uploads/videos",
});
