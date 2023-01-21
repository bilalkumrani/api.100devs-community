const User = require("../../models/userSchema");
const userVerify = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) return res.status(400).send({ message: "Invalid link" });

    const token = await User.findOne({
      _id: user._id,
      mailToken: req.params.token,
    });
    if (!token) return res.status(400).send({ message: "Invalid link" });

    await user.updateOne({ _id: user._id, isVerified: true });
    //await token.remove();

    res.status(200).send({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};
module.exports = userVerify;
