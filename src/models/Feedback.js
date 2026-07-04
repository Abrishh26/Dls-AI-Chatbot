const mongoose = require("mongoose");

const chunkSchema = new mongoose.Schema(
  {
    chunkId: { type: String },
    source: { type: String },
    text: { type: String },
    score: { type: Number },
  },
  { _id: false }
);

const feedbackSchema = new mongoose.Schema(
  {
    sessionId: { type: String, index: true },
    userId: { type: String, index: true },
    question: { type: String, required: true },
    answer: { type: String, required: true },
    retrievedChunks: { type: [chunkSchema], default: [] },
    rating: { type: String, enum: ["up", "down"], required: true },
    comment: { type: String },
    topic: { type: String, index: true },
    createdAt: { type: Date, default: Date.now, index: true },
  },
  { timestamps: false }
);

module.exports = mongoose.model("Feedback", feedbackSchema);