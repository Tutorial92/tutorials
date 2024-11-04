const mongoose = require("mongoose");
var mongoosePaginate = require("mongoose-paginate-v2");

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    lowercase: true,
    minlength: [3, "Title must be 3 characters or more"],
    maxlength: [255, "Title can't exceed 255 characters"],
    required: [true, "Title is required"],
  },
  description: {
    type: String,
    minlength: [50, "Descriptin must be 50 characters or more"],
    required: [true, "Description is required"],
  },
  short_description: {
    type: String,
    minlength: [3, "Title must be 3 characters or more"],
    maxlength: [255, "Title can't exceed 255 characters"],
    required: [true, "Short_description is required"],
  },
  image: { type: String, required: [true, "Image is required"] },
  status: {
    type: String,
    enum: ["publish", "draft", "private"],
    default: "draft",
  },
  youtube_link: { type: String },
  tags: {
    type: String,
  },
  category: {
    type: [String],
    required: [true, "Category is required"],
  },
  author: { type: String, default: "admin" },

  create_date: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to convert each category to lowercase before saving
postSchema.pre("save", function (next) {
  if (this.category && Array.isArray(this.category)) {
    this.category = this.category.map(cat => cat.toLowerCase());
  }
  next();
});

postSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("post", postSchema);
