import User from "../models/User.js";
import bcrypt from "bcrypt";
import fetch from "node-fetch";

export const profile = async (req, res) => {
  const {
    params: { id },
  } = req;
  const user = await User.findOne({ _id: id });
  return res.render("profile", { pageTitle: "Profile", user });
};

export const getEdit = (req, res) => {
  return res.render("edit-profile", { pageTitle: "Edit Profile" });
};

export const postEdit = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
  } = req;
  const {
    body: { name, email },
  } = req;
  if (email !== req.session.user.email) {
    const exists = await User.exists({ email });
    if (exists) {
      return res.status(400).render("edit-profile", {
        pageTitle: "Edit Profile",
        errorMessage: "이미 사용 중인 이메일 입니다.",
      });
    }
  }
  const updatedUser = await User.findByIdAndUpdate(
    _id,
    {
      name,
      email,
    },
    { new: true }
  );
  req.session.user = updatedUser;
  return res.redirect(`/users/${_id}`);
};

export const getLogin = (req, res) => {
  return res.render("login", { pageTitle: "Login" });
};

export const postLogin = async (req, res) => {
  const pageTitle = "Login";
  const {
    body: { username, password },
  } = req;
  const user = await User.findOne({ username, socialOnly: false });
  if (!user) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "아이디가 존재하지 않습니다.",
    });
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "비밀번호가 틀렸습니다.",
    });
  }
  req.session.loggedIn = true;
  req.session.user = user;

  return res.redirect("/");
};

export const startGithubLogin = (req, res) => {
  const baseUrl = "https://github.com/login/oauth/authorize";
  const config = {
    client_id: process.env.GH_CLIENT,
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config);
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};

export const finishGithubLogin = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  const tokenRequest = await (
    await fetch(finalUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();
  if ("access_token" in tokenRequest) {
    const { access_token } = tokenRequest;
    const apiUrl = "https://api.github.com/user";
    const userData = await (
      await fetch(apiUrl, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailData = await (
      await fetch(`${apiUrl}/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailObj = emailData.find(
      (email) => email.primary === true && email.verified === true
    );
    if (!emailObj) {
      return res.redirect("/login");
    }
    let user = await User.findOne({ email: emailObj.email });
    if (!user) {
      user = User.create({
        name: userData.name ? userData.name : "Unknown",
        email: emailObj.email,
        username: userData.login,
        password: "",
        avatarUrl: userData.avatar_url,
        socialOnly: true,
      });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
  } else {
    return res.redirect("/login");
  }
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

export const getChangePassword = (req, res) => {
  const pageTitle = "Change Password";
  if (req.session.user.socialOnly === true) {
    return res.redirect("/");
  }
  return res.render("change-password", { pageTitle });
};
export const postChangePassword = async (req, res) => {
  const pageTitle = "Change Password";
  const {
    body: { nowPassword, newPassword, newPasswordConfirm },
  } = req;
  const {
    session: {
      user: { _id },
    },
  } = req;
  const user = await User.findById(_id);
  const match = await bcrypt.compare(nowPassword, user.password);
  if (!match) {
    return res.status(400).render("change-password", {
      pageTitle,
      errrorMessage: "현재 비밀번호가 다릅니다.",
    });
  }
  if (match) {
    if (nowPassword === newPassword) {
      return res.status(400).render("change-password", {
        pageTitle,
        errrorMessage: "변경하려는 비밀번호가 현재와 일치합니다.",
      });
    }
    if (newPassword !== newPasswordConfirm) {
      return res.status(400).render("change-password", {
        pageTitle,
        errrorMessage: "변경하려는 비밀번호가 일치하지 않습니다.",
      });
    }
  }
  user.password = newPassword;
  await user.save();
  req.session.destroy();
  return res.redirect("/login");
};

export const logout = (req, res) => {
  req.session.loggedIn = false;
  req.session.user = null;
  res.locals.loggedInUser = req.session.user;
  return res.redirect("/");
};
