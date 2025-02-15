require("dotenv").config();
const express = require("express");
const fs = require("fs");
const https = require("https");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
// const verifyToken = require("./verifyToken");
const app = express();
const url = process.env.MONGO_URL;

// Create uploads directories if they don't exist
const uploadDirs = ["uploads", "uploads/sponsorships", "uploads/sliderImages"];
uploadDirs.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
});

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// const options = {
//   key: fs.readFileSync("/etc/letsencrypt/live/kale-cafe.com/privkey.pem"),
//   cert: fs.readFileSync("/etc/letsencrypt/live/kale-cafe.com/cert.pem"),
//   ca: fs.readFileSync("/etc/letsencrypt/live/kale-cafe.com/chain.pem"),
// };

// // Create an HTTPS server with the SSL options
// https.createServer(options, app).listen(444, () => {
//   console.log("HTTPS server running on port 444");
// });

// // Optionally, redirect HTTP to HTTPS
// const http = require("http");
// http
//   .createServer((req, res) => {
//     res.writeHead(301, {
//       Location: "https://" + req.headers["host"] + req.url,
//     });
//     res.end();
//   })
//   .listen(83);
mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true, parameterLimit: 50000 }));

// Add this line to see incoming requests
app.use((req, res, next) => {
  console.log("Request Body:", req.body);
  next();
});

// Add this line before the 404 handler
const imageSliderRouter = require("./routes/imageSlider");
const counterRouter = require("./routes/counter");
const messagesRouter = require("./routes/messages");
const sponsorshipsRouter = require("./routes/sponsorships");
const docsPhotosRouter = require("./routes/docs-photos");
const contactInfoRouter = require("./routes/contactInfo");
const aboutUsRouter = require("./routes/aboutUs");
const supportProjectsRouter = require("./routes/support-projects");
const currentProjectsRouter = require("./routes/current-projects");
const completedProjectsRouter = require("./routes/completed-projects");
const completedCampaginsRouter = require("./routes/completed-campaigns");
const currentCampaginsRouter = require("./routes/current-campaigns");
const supportCampaginsRouter = require("./routes/support-campaigns");
const photosRoutes = require("./routes/docs-photos-route");
const videosRoutes = require("./routes/docs-videos-route");

app.use("/api/image-slider", imageSliderRouter);
app.use("/api/counter", counterRouter);
app.use("/api/messages", messagesRouter);
app.use("/api/sponsorships", sponsorshipsRouter);
app.use("/api/docs-photos", docsPhotosRouter);
app.use("/api/contact-info", contactInfoRouter);
app.use("/api/about-us", aboutUsRouter);
app.use("/api/support-projects", supportProjectsRouter);
app.use("/api/current-projects", currentProjectsRouter);
app.use("/api/completed-projects", completedProjectsRouter);
app.use("/api/completed-campagins", completedCampaginsRouter);
app.use("/api/current-campagins", currentCampaginsRouter);
app.use("/api/support-campagins", supportCampaginsRouter);
app.use("/api/photos", photosRoutes);
app.use("/api/videos", videosRoutes);
// Add root route handler
app.get("/", (req, res) => {
  res.json({ message: "Welcome to OneHeart API" });
});

// 404 handler
app.all("*", (req, res) => {
  res.status(404).json({ message: "Resource not found" });
});
// Start server
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log("Listening on port " + port);
});
