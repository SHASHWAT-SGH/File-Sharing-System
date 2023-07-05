const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name is required for registration!"],
  },
  email: {
    type: String,
    required: [true, "Email is required for registration!"],
    unique: [true, "Email already exists!"],
  },
  password: {
    type: String,
    required: [true, "Password is required for registration!"],
  },
  userType: {
    type: String,
    required: [true, "User Type is required for registration!"],
  },
});

const User = mongoose.model("users", userSchema);

module.exports = { User };
