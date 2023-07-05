const { body } = require("express-validator");
const config = process.env;
const jwt = require("jsonwebtoken");

const signupValidation = [
  body("name", "Please Enter Name").isLength({ min: 4 }),
  body("email", "Enter Valid Email").isEmail(),
  body("password", "Please Enter Valid password").isLength({ min: 4 }),
  body("userType", "Please Enter Valid user type").isIn(["admin", "user"]),
];

const loginValidation = [
  body("email", "Enter Valid Email").isEmail(),
  body("password", "Please Enter Valid password").isLength({ min: 4 }),
];

const isAuthenticated = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res
      .status(403)
      .json({ success: false, msg: "A token is required for authentication" });
  }
  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    req.user = decoded;
  } catch (err) {
    return res.status(401).json({ success: false, msg: "Invalid Token" });
  }

  return next();
};

module.exports = { signupValidation, loginValidation, isAuthenticated };
