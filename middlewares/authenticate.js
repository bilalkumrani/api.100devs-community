const User = require("../models/userSchema");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const authenticate = async (req, res, next) => {
  if (!req.body) {
    return res.json({ error: true, message: "data not found!" });
  } else {
    const { token } = req.body;
    if (!token) {
      return res.json({ message: "Login failed" });
    } else {
      const { _id } = jwt.verify(token, process.env.JT_SECRET);
      const user = await User.findById({ _id });
      if (!user) {
        return res.json({ error: true, message: "login failed" });
      } else {
        req.user = user;
        next();
      }
    }
  }
};
module.exports = authenticate;
