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

export const search = async (req, res) => {
  const {
    query: { keyword },
  } = req;
  let videos = [];
  videos = await Video.find({
    title: {
      $regex: new RegExp(`${keyword}`, "i"),
    },
  });
  return res.render("search", { pageTitle: "Search", videos });
};

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
  const video = await Video.create({
    fileUrl: path,
    title,
    description,
  });
  return res.redirect("/");
};
