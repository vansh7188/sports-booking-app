const express = require("express");
const router = express.Router();
const multer = require("multer");
const streamifier = require("streamifier");
const Ground = require("../models/Ground");
const Feedback = require("../models/feedbackModel");
const protect = require("../middleware/authMiddleware");
const cloudinary = require("../config/cloudinary");

// multer memory storage instead of local disk storage
const storage = multer.memoryStorage();

// file filter for image types
const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only jpg, jpeg, png, webp files are allowed"));
  }
};

const upload = multer({
  storage,
  fileFilter,
});

// upload buffer to cloudinary
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "sports-booking-grounds",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

router.get("/", async (req, res) => {
  try {
    const grounds = await Ground.find().sort({ createdAt: -1 });

    // Get feedback stats for each ground
    const groundsWithFeedback = await Promise.all(
      grounds.map(async (ground) => {
        const feedback = await Feedback.find({ ground: ground._id });
        const averageRating = feedback.length > 0
          ? feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length
          : 0;
        return {
          ...ground.toObject(),
          feedbackCount: feedback.length,
          averageRating: Math.round(averageRating * 10) / 10, // round to 1 decimal
        };
      })
    );

    res.json(groundsWithFeedback);
  } catch (error) {
    console.log("GET grounds error:", error);
    res.status(500).json({ message: "Failed to fetch grounds" });
  }
});

router.get("/mygrounds", protect, async (req, res) => {
  try {
    const grounds = await Ground.find({ owner: req.user.email }).sort({
      createdAt: -1,
    });
    res.json(grounds);
  } catch (error) {
    console.log("MY grounds error:", error);
    res.status(500).json({ message: "Failed to fetch my grounds" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const ground = await Ground.findById(req.params.id);

    if (!ground) {
      return res.status(404).json({ message: "Ground not found" });
    }

    res.json(ground);
  } catch (error) {
    console.log("GET single ground error:", error);
    res.status(500).json({ message: "Failed to fetch ground details" });
  }
});

router.post("/", protect, upload.single("image"), async (req, res) => {
  try {
    const {
      groundName,
      sportType,
      location,
      latitude,
      longitude,
      pricePerHour,
      availableSlots,
      features,
    } =
      req.body;

    const parsedLatitude = Number(latitude);
    const parsedLongitude = Number(longitude);

    if (!Number.isFinite(parsedLatitude) || !Number.isFinite(parsedLongitude)) {
      return res.status(400).json({
        message: "Valid latitude and longitude are required",
      });
    }

    let parsedSlots = [];

    if (availableSlots) {
      try {
        parsedSlots = JSON.parse(availableSlots);
      } catch (err) {
        parsedSlots = Array.isArray(availableSlots)
          ? availableSlots
          : availableSlots.split(",").map((slot) => slot.trim());
      }
    }

    let parsedFeatures = [];

    if (features) {
      try {
        parsedFeatures = JSON.parse(features);
      } catch (err) {
        parsedFeatures = Array.isArray(features)
          ? features
          : features.split(",").map((feature) => feature.trim());
      }
    }

    let imageUrl = "";

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      imageUrl = result.secure_url;
    }

    const newGround = new Ground({
      groundName,
      sportType,
      location,
      latitude: parsedLatitude,
      longitude: parsedLongitude,
      pricePerHour,
      availableSlots: parsedSlots,
      features: parsedFeatures,
      image: imageUrl,
      owner: req.user.email,
    });

    const savedGround = await newGround.save();
    res.status(201).json(savedGround);
  } catch (error) {
    console.log("POST ground error:", error);
    res.status(500).json({
      message: "Failed to add ground",
      error: error.message,
    });
  }
});

module.exports = router;