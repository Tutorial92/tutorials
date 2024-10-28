const express = require("express");
const Post = require("../models/Post");
const router = express.Router();
const cloudinary = require("cloudinary").v2;
const config = require("../helper/config");
const { uploadImages } = require("../helper/uploadToCloudinary");
// const { auth } = require("../middleware/auth");
const multer = require("multer");
const auth = require("../middleware/auth");
const upload = multer();
cloudinary.config({
  cloud_name: config.cloud_name,
  api_key: config.api_key,
  api_secret: config.api_secret,
  secure: true,
});

// Add a new Post (Admin)
router.post(
  "/",
  upload.fields([{ name: "image", maxCount: 1 }]),
  async (req, res) => {
    try {
      // Check for an existing blog with the same title
      const existingBlog = await Post.findOne({ title: req.body.title });
      if (existingBlog) {
        return res
          .status(400)
          .json({ status: false, message: "Blog title already exists" });
      }

      // Image upload handling
      const newBlog = new Post();
      let path = "/images/";
      let uploadResponse = await uploadImages(req.files.image[0].buffer, path);
      newBlog.image = uploadResponse.secure_url;

      // Set other blog properties
      newBlog.title = req.body.title;
      newBlog.description = req.body.description;
      newBlog.short_description = req.body.short_description;
      newBlog.youtube_link = req.body.youtube_link;
      newBlog.tags = req.body.tags;
      newBlog.category = req.body.category;
      newBlog.author = req.body.author;

      // Save the new blog post
      const savedBlog = await newBlog.save();
      res.status(201).json({
        status: false,
        message: "Blog saved successfully",
        data: savedBlog,
      });
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "An error occurred",
        error: err.message,
      });
    }
  }
);

//Update blog
router.put(
  "/:id",
  upload.fields([{ name: "image", maxCount: 1 }]),
  async (req, res) => {
    const { id } = req.params;

    try {
      // Find the existing blog post by ID
      const blog = await Post.findById({ _id: id });
      if (!blog) {
        return res
          .status(404)
          .json({ status: false, message: "Blog not found" });
      }

      // If a new image is uploaded, handle image upload
      if (req.files && req.files.image) {
        let path = "/images/";
        try {
          let uploadResponse = await uploadImages(
            req.files.image[0].buffer,
            path
          );
          blog.image = uploadResponse.secure_url;
        } catch (err) {
          return res.status(500).json({
            status: false,
            message: "Image upload failed",
            error: err.message,
          });
        }
      }

      // Update other fields if they are present in the request body
      if (req.body.title) blog.title = req.body.title;
      if (req.body.description) blog.description = req.body.description;
      if (req.body.short_description)
        blog.short_description = req.body.short_description;
      if (req.body.youtube_link) blog.youtube_link = req.body.youtube_link;
      if (req.body.tags) blog.tags = req.body.tags;
      if (req.body.category) blog.category = req.body.category;
      if (req.body.author) blog.author = req.body.author;

      // Save updated blog
      const updatedBlog = await blog.save();
      res.status(200).json(updatedBlog);
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "An error occurred",
        error: err.message,
      });
    }
  }
);

// Get all Posts
router.get("/", async (req, res) => {
  try {
    const blogs = await Post.find();
    res.json(blogs);
  } catch (err) {
    res.status(500).json(err);
  }
});

//filter posts by category
router.get("/category/:category", async (req, res) => {
  const { category } = req.params;

  try {
    // Find posts by category
    const posts = await Post.find({ category: category });
    if (posts.length === 0) {
      return res
        .status(404)
        .json({ status: false, message: "No posts found in this category" });
    }

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "An error occurred",
      error: err.message,
    });
  }
});

//latest posts
router.get("/latest-posts", async (req, res) => {
  try {
    const latestPosts = await Post.aggregate([
      {
        // Group by category and get the latest post in each category
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: "$category",
          latestPost: { $first: "$$ROOT" }, // Get the most recent post in each category
        },
      },
      {
        // Optionally, project only the fields you want to include in the result
        $project: {
          _id: 0,
          category: "$_id",
          image: "$latestPost.image",
          title: "$latestPost.title",
        },
      },
    ]);

    if (!latestPosts.length) {
      return res.status(404).json({ status: false, message: "No posts found" });
    }

    res.status(200).json({
      status: true,
      message: "Latest posts fetched successfully",
      data: latestPosts,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "An error occurred",
      error: err.message,
    });
  }
});

//Get post by id
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Find the post by ID
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ status: false, message: "Post not found" });
    }

    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "An error occurred",
      error: err.message,
    });
  }
});

module.exports = router;
