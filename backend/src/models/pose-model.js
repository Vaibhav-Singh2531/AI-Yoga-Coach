const mongoose = require("mongoose");

const poseSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name_english: {
    type: String,
    required: true,
    trim: true
  },
  name_sanskrit: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    enum: ["Standing", "Sitting", "Backbend", "Forward Bend", "Balancing", "Inversion", "Twist", "Restorative"],
    required: true
  },
  difficulty: {
    type: String,
    enum: ["Beginner", "Intermediate", "Advanced"],
    required: true
  },
  benefits: {
    type: [String],
    default: []
  },
  contraindications: {
    type: [String],
    default: []
  },
  steps: {
    type: [String],
    required: true
  },
  duration: {
    type: String,
    default: "30-60 seconds"
  },
  image_url: {
    type: String,
    validate: {
      validator: (v) => /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/.test(v),
      message: "Invalid image URL"
    }
  },
  target_muscles: {
    type: [String],
    default: []
  },
  breathing: {
    type: String,
    default: "Normal breathing"
  },
  tags: {
    type: [String],
    index: true // helps in search/filtering
  }
}, { timestamps: true });

const Pose = mongoose.model("Pose",poseSchema);


module.exports = Pose;
