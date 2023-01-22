const User = require("../../models/userSchema");
const bcrypt = require("bcrypt");
const { checkUserData } = require("../helperFunctions");
const crypto = require("crypto");
const sendMail = require("../../utils/sendMail");
require("dotenv").config();
const url = process.env.BASE_URL;

const userRegister = async (req, res) => {
  const mailToken = crypto.randomBytes(32).toString("hex");
  const { firstName, lastName, email, password: originalPass } = req.body;

  if (checkUserData(firstName, lastName, email, originalPass)) {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      const password = await bcrypt.hash(originalPass, 10);
      try {
        const user = await User.create({
          firstName,
          lastName,
          email,
          password,
          mailToken,
          isVerified: false,
        });
        const verificationUrl = `${url}/${user._id}/verify/${mailToken}`;
        sendMail(email, "Verify Email", verificationUrl);
        return res.status(200).json({ status: "ok", data: user });
      } catch (error) {
        return res.json({ status: "User not added", error });
      }
    } else {
      return res.json({ message: "already existing user" });
    }
  } else {
    return res.status(400).json({ error: "incomplete data" });
  }
};

module.exports = userRegister;
