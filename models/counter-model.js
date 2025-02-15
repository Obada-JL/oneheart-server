const mongoose = require("mongoose");

const countersSchema = new mongoose.Schema({
  counterImage: {
    type: String,
  },
  counterTitle: {
    type: String,
  },
  counterNumber: {
    type: String,
  },
});
module.exports = mongoose.model("Counter", countersSchema);
