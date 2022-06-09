import Video from "../models/video.js";

export const home = async (req, res) => {
  const videos = await Video.find();
  return res.render("home", { pageTitle: "Home", videos });
};

export const watch = async (req, res) => {
  const {
    params: { id },
  } = req;
  const video = await Video.findOne({ _id: id });
  return res.render("watch", { pageTitle: video.title, video });
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
    file: { path },
  } = req;
  await Video.create({
    fileUrl: path,
    title,
    description,
  });
  return res.redirect("/");
};
