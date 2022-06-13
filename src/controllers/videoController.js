import User from "../models/User.js";
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
    session: {
      user: { _id },
    },
  } = req;
  const {
    body: { title, description },
  } = req;
  const {
    file: { path },
  } = req;
  try {
    const newVideo = await Video.create({
      fileUrl: path,
      title,
      description,
      owner: _id,
    });
    const user = await User.findById(_id);
    user.videos.push(newVideo._id);
    await user.save();
    return res.redirect("/");
  } catch (error) {
    return res.status(400).render("upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
};

export const getEdit = async (req, res) => {
  const {
    params: { id },
  } = req;
  const video = await Video.findById({ _id: id });
  return res.render("edit-video", { pageTitle: `Edit ${video.title}`, video });
};

export const postEdit = async (req, res) => {
  const {
    params: { id },
  } = req;
  const {
    body: { title, description },
  } = req;
  await Video.findByIdAndUpdate(
    { _id: id },
    {
      title,
      description,
    },
    { new: true }
  );
  return res.redirect(`/videos/${id}`);
};

export const deleteVideo = async (req, res) => {
  const videoId = req.params.id;
  const userId = req.session.user._id;

  const video = await Video.findById({ _id: videoId });
  const user = await User.findById({ _id: userId });
  if (!video) {
    return res.redirect("/");
  }
  if (String(video.owner) !== String(user._id)) {
    return res.redirect("/");
  }
  await Video.findByIdAndDelete({ _id: videoId });
  user.videos.splice(user.videos.indexOf(videoId), 1);
  await user.save();
  return res.redirect("/");
};
