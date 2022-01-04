const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
  original_url: {
    type: String,
    require: true,
    trim: true,
  },
  short_url: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("URLs", urlSchema);
