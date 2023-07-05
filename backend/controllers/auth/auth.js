const { User } = require("../../model/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const { validationResult } = require("express-validator");

const registerUser = async (req, res) => {
  const errors = validationResult(req);
  // checking data validation
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, error: errors.array() });
  }
  try {
    const userFound = await User.findOne({ email: req.body.email });
    // if user already exists
    if (userFound) {
      return res
        .status(403)
        .json({ success: false, msg: "User Already Exists." });
    }
    // hashing password
    const hash = await bcrypt.hash(req.body.password, 10);
    // add user to database
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: hash,
      userType: req.body.userType,
    });

    // Create token
    const token = jwt.sign(
      {
        user_id: user._id,
        name: req.body.name,
        email: req.body.email,
        userType: req.body.userType,
      },
      process.env.TOKEN_KEY,
      {
        expiresIn: "1h",
      }
    );

    res
      .status(201)
      .cookie("token", token, {
        path: "/",
        httpOnly: true, // The cookie cannot be accessed by JavaScript
        secure: true, // Set 'secure' to true if using HTTPS
        sameSite: "lax", // Specify the SameSite attribute for better security
        expires: new Date(Date.now() + 1000 * 60 * 60),
      })
      .json({ success: true, msg: "User Created Successfully." });
  } catch (err) {
    console.log("Error in Adding User:", err);
  }
};

const loginUser = async (req, res) => {
  try {
    const userFound = await User.findOne({ email: req.body.email });
    if (!userFound) {
      return res.status(404).json({ success: false, msg: "User Not Found!" });
    }
    const passMatched = await bcrypt.compare(
      req.body.password,
      userFound.password
    );
    if (passMatched) {
      const token = jwt.sign(
        {
          user_id: userFound._id,
          name: req.body.name,
          email: req.body.email,
          userType: req.body.userType,
        },
        process.env.TOKEN_KEY,
        {
          expiresIn: "1h",
        }
      );
      return res
        .status(200)
        .cookie("token", token, {
          path: "/",
          httpOnly: true, // The cookie cannot be accessed by JavaScript
          secure: true, // Set 'secure' to true if using HTTPS
          sameSite: "lax", // Specify the SameSite attribute for better security
          expires: new Date(Date.now() + 1000 * 60 * 60),
        })
        .json({ success: true, msg: "User Successfully Logged in." });
    }

    return res.status(401).json({ success: false, msg: "Incorrect Password" });
  } catch (err) {
    console.log("Error occured while loging in :", err);
  }
};

module.exports = { registerUser, loginUser };
