const mongoose = require("mongoose");

const translatedContentSchema = {
  en: { type: String, required: true },
  ar: { type: String, required: true },
};

const aboutUsSchema = new mongoose.Schema(
  {
    aboutUs: {
      description: translatedContentSchema,
      photos: {
        type: [String],
        required: true,
        validate: [arrayLimit, "About Us section can only have 2 photos"],
      },
    },
    goal: {
      description: translatedContentSchema,
      photo: { type: String, required: true },
    },
    vision: {
      description: translatedContentSchema,
      photo: { type: String, required: true },
    },
    message: {
      description: translatedContentSchema,
      photo: { type: String, required: true },
    },
    values: {
      description: translatedContentSchema,
      photo: { type: String, required: true },
    },
  },
  { timestamps: true }
);

function arrayLimit(val) {
  return val.length <= 2;
}

const AboutUs = mongoose.model("AboutUs", aboutUsSchema);

module.exports = AboutUs;
