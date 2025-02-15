const Videos = require("../models/docs-videos-model");

const createVideos = async (req, res) => {
  try {
    console.log("Received request body:", req.body); // Debug log
    console.log("Received files:", req.files); // Debug log

    // If data is coming as form-data, it might need JSON.parse
    let videoData = req.body;
    if (typeof req.body.video === "string") {
      try {
        videoData = {
          ...req.body,
          video: JSON.parse(req.body.video),
        };
      } catch (e) {
        console.log("Error parsing video data:", e);
      }
    }

    const newVideo = new Videos({
      Name: videoData.Name,
      Description: videoData.Description,
      category: videoData.category,
      video: req.files
        ? req.files.map((file) => file.filename)
        : videoData.video || [],
    });

    // Validation
    if (!newVideo.Name || !newVideo.Description || !newVideo.category) {
      return res.status(400).json({
        message: "Missing required fields",
        required: ["Name", "Description", "category"],
        received: videoData,
        rawBody: req.body, // Debug info
      });
    }

    const savedVideo = await newVideo.save();
    res.status(201).json(savedVideo);
  } catch (error) {
    console.error("Error creating video:", error);
    res.status(500).json({
      message: error.message,
      receivedData: {
        body: req.body,
        files: req.files,
        contentType: req.headers["content-type"], // Debug info
      },
    });
  }
};

const getAllVideos = async (req, res) => {
  try {
    const videos = await Videos.find({});
    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateVideos = async (req, res) => {
  try {
    const { id } = req.params;
    const { Name, Description, category } = req.body;

    const existingVideo = await Videos.findById(id);
    if (!existingVideo) {
      return res.status(404).json({ message: "Video not found" });
    }

    const updateData = {
      Name: Name || existingVideo.Name,
      Description: Description || existingVideo.Description,
      category: category || existingVideo.category,
    };

    if (req.files && req.files.length > 0) {
      updateData.video = req.files.map((file) => file.filename);
    }

    const updatedVideo = await Videos.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    res.status(200).json(updatedVideo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteVideos = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedVideo = await Videos.findByIdAndDelete(id);

    if (!deletedVideo) {
      return res.status(404).json({ message: "Video not found" });
    }

    res.status(200).json({ message: "Video deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createVideos,
  getAllVideos,
  updateVideos,
  deleteVideos,
};
