const mongoose = require("mongoose");

const countersSchema = new mongoose.Schema({
  counterImage: {
    type: String,
  },
  counterTitle: {
    type: String,
    required: true,
  },
  counterTitleAr: {
    type: String,
    required: true,
  },
  counterNumber: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Counter", countersSchema);
