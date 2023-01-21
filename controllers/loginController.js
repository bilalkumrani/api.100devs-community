const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/userSchema");
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(422).json({ error: "password or email is missing" });
    }
    const savedUser = await User.findOne({ email });
    if (!savedUser) {
      return res.status(422).json({ error: "Invalid password or Email" });
    }

    let matched = await bcrypt.compare(password, savedUser.password);
    if (matched) {
      const userData = {
        sub: savedUser._id,
        email: savedUser.email,
        name: `${savedUser.firstName} ${savedUser.lastName}`,
        iat: Math.round(new Date().getTime() / 1000),
        exp: Math.round(new Date().getTime() / 1000) + 60,
      };

      const token = jwt.sign(userData, process.env.JT_SECRET, {
        algorithm: "HS256",
      });

      const embedURL = "/spaces?layout=default";
      const iframeSrc = `https://test0.tribeplatform.com/api/auth/sso?jwt=${token}&redirect_uri=${encodeURIComponent(
        embedURL
      )}`;

      // return res.send(
      //   `<html><body><iframe src="${iframeSrc}" frameBorder="0" width="100%"></iframe></body></html>`
      // );

      return res.json({
        status: "ok",
        user: savedUser,
        token,
        url: iframeSrc,
      });
    } else {
      res.status(422).json({ error: "Invalid password or Eamil" });
    }
  } catch (error) {
    return res.json({ error: true, message: error });
  }
};

module.exports = login;
