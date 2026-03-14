const express = require("express");
const router = express.Router();
const Feedback = require("../models/Feedback");
const Ground = require("../models/Ground");
const User = require("../models/User");
const protect = require("../middleware/authMiddleware");

// Get feedback for a ground
router.get("/:groundId", async (req, res) => {
  try {
    const feedback = await Feedback.find({ ground: req.params.groundId })
      .sort({ createdAt: -1 });
    res.json(feedback);
  } catch (error) {
    console.log("GET feedback error:", error);
    res.status(500).json({ message: "Failed to fetch feedback" });
  }
});

// Add feedback for a ground
router.post("/:groundId", protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;

    // Get user from email
    const user = await User.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if ground exists
    const ground = await Ground.findById(req.params.groundId);
    if (!ground) {
      return res.status(404).json({ message: "Ground not found" });
    }

    // Check if user already gave feedback
    const existingFeedback = await Feedback.findOne({
      ground: req.params.groundId,
      user: req.user.email,
    });

    if (existingFeedback) {
      return res.status(400).json({ message: "You have already given feedback for this ground" });
    }

    const newFeedback = new Feedback({
      ground: req.params.groundId,
      user: req.user.email,
      userName: user.name,
      rating,
      comment,
    });

    const savedFeedback = await newFeedback.save();

    res.status(201).json(savedFeedback);
  } catch (error) {
    console.log("POST feedback error:", error);
    res.status(500).json({
      message: "Failed to add feedback",
      error: error.message,
    });
  }
});

module.exports = router;