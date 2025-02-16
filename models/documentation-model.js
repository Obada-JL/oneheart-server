const mongoose = require("mongoose");

const documentationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  titleAr: { type: String, required: true },
  description: { type: String, required: true },
  descriptionAr: { type: String, required: true },
  images: {
    type: [String],
    required: true,
    validate: [
      {
        validator: function (array) {
          return array.length <= 3;
        },
        message: "Images array cannot have more than 3 images",
      },
    ],
  },
  detailsLink: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Documentation", documentationSchema);
