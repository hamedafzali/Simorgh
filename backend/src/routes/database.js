const express = require("express");
const router = express.Router();
const Exam = require("../../database/models/Exam");
const Flashcard = require("../../database/models/Flashcard");
const Word = require("../../database/models/Word");

const DATABASE_VERSION = {
  version: "1.0.0",
  timestamp: Date.now(),
  description: "Initial database with 5000 exams and flashcards",
};

// Get database version
router.get("/version", async (req, res) => {
  try {
    res.json(DATABASE_VERSION);
  } catch (error) {
    console.error("Version error:", error);
    res.status(500).json({ error: "Failed to get database version" });
  }
});

// Get all exams for database sync
router.get("/exams", async (req, res) => {
  try {
    const exams = await Exam.find({ isActive: true }).sort({ createdAt: -1 });

    const formattedExams = exams.map((exam) => ({
      id: exam._id.toString(),
      title: exam.title,
      description: exam.description,
      level: exam.level,
      category: exam.topicCategory,
      duration: exam.durationMinutes,
      questionCount: exam.questions.length,
      passingScore: exam.passingScore,
      maxAttempts: exam.maxAttempts,
      questions: exam.questions,
      instructions:
        exam.instructions ||
        `Complete all ${exam.questions.length} questions to the best of your ability. You have ${exam.durationMinutes} minutes.`,
    }));

    res.json({ exams: formattedExams });
  } catch (error) {
    console.error("Database exams error:", error);
    res.status(500).json({ error: "Failed to get database exams" });
  }
});

// Get all flashcards for database sync
router.get("/flashcards", async (req, res) => {
  try {
    const flashcards = await Flashcard.find().sort({ createdAt: -1 });

    const formattedFlashcards = flashcards.map((card) => ({
      id: card._id.toString(),
      front: card.front,
      back: card.back,
      type: card.type || "general",
      level: card.level || "A1",
      category: card.category || "general",
      nextReview: card.nextReview || Date.now(),
      reviewCount: card.reviewCount || 0,
      difficulty: card.difficulty || 1,
    }));

    res.json({ flashcards: formattedFlashcards });
  } catch (error) {
    console.error("Database flashcards error:", error);
    res.status(500).json({ error: "Failed to get database flashcards" });
  }
});

// Get all words for database sync
router.get("/words", async (req, res) => {
  try {
    const words = await Word.find().sort({ frequency: -1 });

    const formattedWords = words.map((word) => ({
      id: word._id.toString(),
      german: word.german,
      english: word.english,
      category: word.category || "general",
      level: word.level || "A1",
      frequency: word.frequency || 1,
      examples: word.examples || [],
    }));

    res.json({ words: formattedWords });
  } catch (error) {
    console.error("Database words error:", error);
    res.status(500).json({ error: "Failed to get database words" });
  }
});

// Get database statistics
router.get("/stats", async (req, res) => {
  try {
    const [examCount, flashcardCount, wordCount] = await Promise.all([
      Exam.countDocuments({ isActive: true }),
      Flashcard.countDocuments(),
      Word.countDocuments(),
    ]);

    res.json({
      version: DATABASE_VERSION,
      stats: {
        exams: examCount,
        flashcards: flashcardCount,
        words: wordCount,
        lastUpdated: DATABASE_VERSION.timestamp,
      },
    });
  } catch (error) {
    console.error("Database stats error:", error);
    res.status(500).json({ error: "Failed to get database stats" });
  }
});

module.exports = router;
