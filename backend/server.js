require("dotenv").config();
const express = require("express");
const fileUpload = require("express-fileupload");
const path = require("path");
const db = require("./config/db");
const { authRoutes } = require("./routes/auth");
const { isAuthenticated } = require("./middlewares/auth");
const cookieParser = require("cookie-parser");

// ----------------------------------------- Import End -----------------------------------------
// Initialise express
const app = express();

// ----------------------------------------- Middleware -----------------------------------------
app.use(fileUpload());
app.use(express.json());
app.use(cookieParser());
// app.use(express.static("uploads"));

// authentication routes
app.use("/auth", authRoutes);
app.get("/secret", isAuthenticated, (req, res) => {
  res.status(200).send("U are Logged in and accessing secret page.");
});
// Start the server
app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});

// app.post("/upload", (req, res) => {
//   if (!req.files || !req.files.file) {
//     return res.status(400).send("No files were uploaded.");
//   }

//   const file = req.files.file;

//   // Generate a unique filename
//   const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//   const filename = file.name.replace(/ /g, "_");
//   const filePath = path.join(
//     __dirname,
//     "uploads",
//     filename + "-" + uniqueSuffix
//   );

//   // Save the file to the server
//   file.mv(filePath, (err) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).send("Internal Server Error");
//     }

//     res.send("File uploaded successfully");
//   });
// });

// app.get("/getfile", (req, res) => {
//   const filepath = __dirname + "/uploads/dummy.txt";
//   res.download(filepath);
// });
