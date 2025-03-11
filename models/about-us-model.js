const mongoose = require("mongoose");

// Optional translated content schema for all sections
const optionalTranslatedContentSchema = {
  en: { type: String, required: false, default: "" },
  ar: { type: String, required: false, default: "" },
};

const aboutUsSchema = new mongoose.Schema(
  {
    aboutUs: {
      description: optionalTranslatedContentSchema,
      photos: {
        type: [String],
        required: false,
        default: [],
        validate: [arrayLimit, "About Us section can only have 2 photos"],
      },
    },
    goal: {
      description: optionalTranslatedContentSchema,
      photo: { type: String, required: false, default: "" },
    },
    vision: {
      description: optionalTranslatedContentSchema,
      photo: { type: String, required: false, default: "" },
    },
    message: {
      description: optionalTranslatedContentSchema,
      photo: { type: String, required: false, default: "" },
    },
    values: {
      description: optionalTranslatedContentSchema,
      photo: { type: String, required: false, default: "" },
    },
  },
  { timestamps: true }
);

function arrayLimit(val) {
  return val.length <= 2;
}

const AboutUs = mongoose.model("AboutUs", aboutUsSchema);

module.exports = AboutUs;
