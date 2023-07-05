const express = require("express");
const { registerUser, loginUser } = require("../controllers/auth/auth");
const { signupValidation, loginValidation } = require("../middlewares/auth");

const authRoutes = express.Router();

authRoutes.post("/signup", signupValidation, registerUser);
authRoutes.post("/login", loginValidation, loginUser);

module.exports = { authRoutes };
