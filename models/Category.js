const mongoose = require("mongoose");
var mongoosePaginate = require("mongoose-paginate-v2");

const categorySchema = new mongoose.Schema({
  category_name: {
    type: String,
    minlength: [3, "Title must be 3 characters or more"],
    maxlength: [255, "Title can't exceed 255 characters"],
    required: true,
  },
  created_by: { type: String, default: "admin" },
  create_date: {
    type: Date,
    default: Date.now,
  },
});

categorySchema.plugin(mongoosePaginate);

module.exports = mongoose.model("category", categorySchema);
