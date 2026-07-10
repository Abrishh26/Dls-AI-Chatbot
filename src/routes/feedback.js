// routes/feedback.js
// Mount this in your main app: app.use("/api/feedback", require("./routes/feedback"));

const express = require("express");
const router = express.Router();
const Feedback = require("../models/Feedback");
const { requireAuth } = require("../middleware/auth");
const { chatRateLimiter } = require("../middleware/rateLimit");

/**
 * POST /api/feedback
 * Call this right after the bot sends an answer, once the user taps thumbs up/down.
 *
 * Expected body:
 * {
 *   sessionId: "abc123",
 *   userId: "user_42",            // optional
 *   question: "How does photosynthesis work?",
 *   answer: "Photosynthesis is...",
 *   retrievedChunks: [
 *     { chunkId: "bio_ch4_p2", source: "biology_module4.pdf", text: "...", score: 0.87 }
 *   ],
 *   rating: "up" | "down",
 *   comment: "optional free text",
 *   topic: "biology"              // optional, tag curriculum area
 * }
 */
router.post("/", requireAuth, chatRateLimiter, async (req, res) => {
  try {
    const { question, answer, rating } = req.body;

    if (!question || !answer || !rating) {
      return res.status(400).json({
        error: "question, answer, and rating are required",
      });
    }

    if (!["up", "down"].includes(rating)) {
      return res.status(400).json({ error: "rating must be 'up' or 'down'" });
    }

    const entry = await Feedback.create(req.body);
    res.status(201).json({ success: true, id: entry._id });
  } catch (err) {
    console.error("Failed to save feedback:", err);
    res.status(500).json({ error: "Failed to save feedback" });
  }
});

/**
 * PATCH /api/feedback/:id/comment
 * Attach an optional free-text comment to an existing feedback entry
 * (used after a thumbs-down, when the user explains what was wrong).
 *
 * Expected body: { comment: "the answer skipped the edge case" }
 */
router.patch("/:id/comment", requireAuth, async (req, res) => {
  try {
    const { comment } = req.body;
    if (!comment) {
      return res.status(400).json({ error: "comment is required" });
    }

    const entry = await Feedback.findByIdAndUpdate(
      req.params.id,
      { comment },
      { new: true }
    );

    if (!entry) {
      return res.status(404).json({ error: "Feedback entry not found" });
    }

    res.json({ success: true, id: entry._id });
  } catch (err) {
    console.error("Failed to save comment:", err);
    res.status(500).json({ error: "Failed to save comment" });
  }
});

/**
 * GET /api/feedback/stats
 * Aggregated view: per-topic thumbs up/down counts + down-rate.
 * This is what tells you "which curriculum areas need better source material".
 *
 * Optional query params: ?from=2026-01-01&to=2026-07-01
 */
router.get("/stats", requireAuth, async (req, res) => {
  try {
    const match = {};
    if (req.query.from || req.query.to) {
      match.createdAt = {};
      if (req.query.from) match.createdAt.$gte = new Date(req.query.from);
      if (req.query.to) match.createdAt.$lte = new Date(req.query.to);
    }

    const stats = await Feedback.aggregate([
      { $match: match },
      {
        $group: {
          _id: { topic: { $ifNull: ["$topic", "untagged"] }, rating: "$rating" },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: "$_id.topic",
          ratings: { $push: { rating: "$_id.rating", count: "$count" } },
          total: { $sum: "$count" },
        },
      },
      { $sort: { total: -1 } },
    ]);

    const reshaped = stats.map((s) => {
      const up = s.ratings.find((r) => r.rating === "up")?.count || 0;
      const down = s.ratings.find((r) => r.rating === "down")?.count || 0;
      const total = up + down;
      return {
        topic: s._id,
        up,
        down,
        total,
        downRate: total ? +(down / total).toFixed(2) : 0,
      };
    });

    res.json(reshaped);
  } catch (err) {
    console.error("Failed to compute stats:", err);
    res.status(500).json({ error: "Failed to compute stats" });
  }
});

/**
 * GET /api/feedback/negatives
 * Pull the raw thumbs-down entries — this is your eval set for debugging
 * bad answers and finding which chunks were retrieved but weren't good enough.
 */
router.get("/negatives", requireAuth, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const negatives = await Feedback.find({ rating: "down" })
      .sort({ createdAt: -1 })
      .limit(limit);
    res.json(negatives);
  } catch (err) {
    console.error("Failed to fetch negatives:", err);
    res.status(500).json({ error: "Failed to fetch negatives" });
  }
});

module.exports = router;