const express = require("express");
const app = express();
const port = 3000;

// ...existing code...

const programRoutes = require("./routes/program-routes");
const campaignVideoRoutes = require("./routes/campaign-video-routes");
const userRoutes = require("./routes/user-routes");

// ...existing code...

app.use("/api/programs", programRoutes);
app.use("/api/campaign-videos", campaignVideoRoutes);
app.use("/api/users", userRoutes);

// ...existing code...

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
