import User from "../models/User.js";
import bcrypt from "bcrypt";

export const getLogin = (req, res) => {
  return res.render("login", { pageTitle: "Login" });
};

export const postLogin = async (req, res) => {
  const pageTitle = "Login";
  const {
    body: { username, password },
  } = req;
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "아이디가 존재하지 않습니다.",
    });
  }
  const match = bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "비밀번호가 틀렸습니다.",
    });
  }

  return res.redirect("/");
};

export const getJoin = (req, res) => {
  return res.render("join", { pageTitle: "Join" });
};

export const postJoin = async (req, res) => {
  const pageTitle = "Join";
  const {
    body: { name, email, username, password, confirmPassword },
  } = req;
  if (password !== confirmPassword) {
    return res.status(404).render("join", {
      pageTitle,
      errorMessage: "비밀번호가 서로 일치하지 않습니다.",
    });
  }
  const exists = await User.exists({ $or: [{ username }, { email }] });
  if (exists) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "아이디 또는 이메일 이(가) 이미 존재합니다.",
    });
  }
  try {
    await User.create({
      name,
      email,
      username,
      password,
    });
    return res.redirect("/login");
  } catch (error) {
    return res
      .status(404)
      .render("/join", { pageTitle, errorMessage: error._message });
  }
};
