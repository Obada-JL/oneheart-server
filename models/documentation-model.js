const mongoose = require("mongoose");

const documentationSchema = new mongoose.Schema({
  title: {
    en: { type: String, required: true },
    ar: { type: String, required: true }
  },
  description: {
    en: { type: String, required: true },
    ar: { type: String, required: true }
  },
  images: {
    type: [String],
    required: true,
    validate: {
      validator: function(v) {
        return v.length > 0 && v.length <= 3;
      },
      message: 'Documentation must have between 1 and 3 images'
    }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Documentation", documentationSchema);
