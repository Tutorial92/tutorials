const mongoose = require("mongoose");
var mongoosePaginate = require("mongoose-paginate-v2");

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    minlength: [3, "Title must be 3 characters or more"],
    maxlength: [255, "Title can't exceed 255 characters"],
    required: true,
  },
  description: {
    type: String,
    minlength: [50, "Descriptin must be 50 characters or more"],
    required: true,
  },
  short_description: {
    type: String,
    minlength: [3, "Title must be 3 characters or more"],
    maxlength: [255, "Title can't exceed 255 characters"],
    required: true,
  },
  image: { type: String, required: true },
  status: {
    type: String,
    enum: ["publish", "draft", "private"],
    default: "draft",
    required: true,
  },
  youtube_link: { type: String },
  tags: {
    type: String,
  },
  category: { type: String, required: true },
  author: { type: String, default: "admin" },

  create_date: {
    type: Date,
    default: Date.now,
  },
});

postSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("post", postSchema);
