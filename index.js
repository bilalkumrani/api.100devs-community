const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const db = require("./config");
const userRoutes = require("./routes/userRoutes/userRoutes");
const cors = require("cors");
const login = require("./controllers/loginController");
const userRegister = require("./controllers/userControllers/userRegister");
const userVerify = require("./controllers/userControllers/userVerify");
const authenticate = require("./middlewares/authenticate");
require("dotenv").config();

// allowing cors for local enviroment
const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});
app.use(bodyParser.json({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).json({ status: "ok", message: "welcome" });
});

app.post("/register", userRegister);
app.post("/login", login);
app.get("/:id/verify/:token", userVerify);
app.use("/user", authenticate, userRoutes);

app.listen(process.env.API_PORT, () => {
  console.log("listening on PORT: ", process.env.API_PORT);
});
