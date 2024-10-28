const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const userRoutes = require("./routes/user");
const postRoutes = require("./routes/post");
const categoryRoutes = require("./routes/category");

// Middleware
app.use(express.json());

app.use(cors()); // Add CORS support
app.use(express.json()); // Middleware to parse JSON

// Routes
app.use("/user", userRoutes);
app.use("/post", postRoutes);
app.use("/category", categoryRoutes);

// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://emailtutorial92:AxgBEoL5INBowFDP@cluster0.swrzh.mongodb.net/tutorials"
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch(error => {
    console.log("Error connecting to MongoDB:", error);
  });

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
