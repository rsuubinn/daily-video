import Video from "../models/video.js";

export const home = async (req, res) => {
  const videos = await Video.find();
  console.log(videos);
  return res.render("home", { pageTitle: "Home", videos });
};

export const search = (req, res) => {};

export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload" });
};
export const postUpload = async (req, res) => {
  const {
    body: { title, description },
  } = req;
  const {
    file: { fileName },
  } = req;
  const video = await Video.create({
    title,
    description,
  });

  return res.redirect("/");
};
