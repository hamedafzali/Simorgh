const express = require("express");
const router = express.Router();

// Import database models and seed data
const seedDatabase = require("../seed/seedData");
const generate5000Flashcards = require("../seed/generate5000Flashcards");
const linkFlashcardsToWords = require("../seed/linkFlashcardsToWords");
const generateMoreFlashcards = require("../seed/generateMoreFlashcards");
const createImprovedGermanExams = require("../seed/improvedExams");
const generate5000Exams = require("../seed/generate5000Exams");
const Exercise = require("../../database/models/Exercise");
const Word = require("../../database/models/Word");
const Flashcard = require("../../database/models/Flashcard");
const UserProgress = require("../../database/models/UserProgress");
const Exam = require("../../database/models/Exam");

// Initialize database connection (mock for now)
let dbInitialized = false;
const ensureDB = async () => {
  if (!dbInitialized) {
    console.log("Database initialization (mock)");
    dbInitialized = true;
  }
};

// Seed database endpoint
router.post("/seed", async (req, res) => {
  try {
    await ensureDB();
    await seedDatabase();
    res.json({ message: "Database seeded successfully!" });
  } catch (error) {
    console.error("Seed error:", error);
    res.status(500).json({ error: "Failed to seed database" });
  }
});

// Generate 5000 flashcards endpoint
router.post("/seed/5000", async (req, res) => {
  try {
    await generate5000Flashcards();
    res.json({ message: "5000 flashcards generated successfully!" });
  } catch (error) {
    console.error("5000 flashcards error:", error);
    res.status(500).json({ error: "Failed to generate 5000 flashcards" });
  }
});

// Link flashcards to words endpoint
router.post("/seed/link", async (req, res) => {
  try {
    const linkedCount = await linkFlashcardsToWords();
    res.json({
      message: `Successfully linked ${linkedCount} flashcards to words!`,
    });
  } catch (error) {
    console.error("Linking error:", error);
    res.status(500).json({ error: "Failed to link flashcards to words" });
  }
});

// Generate more flashcards endpoint
router.post("/seed/more", async (req, res) => {
  try {
    const generatedCount = await generateMoreFlashcards();
    res.json({
      message: `Successfully generated ${generatedCount} additional flashcards!`,
    });
  } catch (error) {
    console.error("Generation error:", error);
    res.status(500).json({ error: "Failed to generate more flashcards" });
  }
});

// Create improved German exams endpoint
router.post("/seed/exams", async (req, res) => {
  try {
    const examCount = await createImprovedGermanExams();
    res.json({
      message: `Successfully created ${examCount} improved German exams!`,
    });
  } catch (error) {
    console.error("Exam creation error:", error);
    res.status(500).json({ error: "Failed to create improved exams" });
  }
});

// Generate 5000 exams endpoint
router.post("/seed/5000exams", async (req, res) => {
  try {
    const examCount = await generate5000Exams();
    res.json({ message: `Successfully generated ${examCount} German exams!` });
  } catch (error) {
    console.error("5000 exams error:", error);
    res.status(500).json({ error: "Failed to generate 5000 exams" });
  }
});

// Learning stats endpoint
router.get("/stats", async (req, res) => {
  try {
    await ensureDB();

    // Get real stats from database
    const totalWords = await Word.countDocuments();
    const totalExercises = await Exercise.countDocuments({ isActive: true });
    const totalFlashcards = await Flashcard.countDocuments();
    const totalExams = await Exam.countDocuments();

    // Get user progress (mock user for now)
    const userProgress = await UserProgress.findOne({ userId: "current-user" });

    const stats = {
      totalWords,
      masteredWords: userProgress?.masteredWords || 0,
      accuracy: userProgress?.accuracy || 0.78,
      streakDays: userProgress?.streakDays || 7,
      totalReviews: userProgress?.totalReviews || 230,
      currentLevel: userProgress?.currentLevel || "A2",
      wordsByLevel: {
        A1: await Word.countDocuments({ level: "A1" }),
        A2: await Word.countDocuments({ level: "A2" }),
        B1: await Word.countDocuments({ level: "B1" }),
      },
      grammarProgress: userProgress?.grammarProgress || {
        present: 0.8,
        past: 0.6,
        future: 0.4,
      },
      totalExams: userProgress?.totalExams || 0,
      lastExamScore: userProgress?.lastExamScore || 0,
    };

    res.json(stats);
  } catch (error) {
    console.error("Stats error:", error);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

// Exercises endpoint
router.get("/exercises", async (req, res) => {
  try {
    const { level, type, category } = req.query;
    let query = { isActive: true };

    if (level) query.level = level;
    if (type) query.exerciseType = type;
    if (category) query.topicCategory = category;

    const exercises = await Exercise.find(query)
      .sort({ difficultyScore: 1 })
      .limit(20);

    const formattedExercises = exercises.map((exercise) => ({
      id: exercise._id.toString(),
      title: exercise.title,
      type: exercise.exerciseType,
      level: exercise.level,
      difficulty: exercise.difficultyScore,
      questionCount: exercise.questions.length,
      timeLimit: exercise.timeLimitMinutes,
    }));

    res.json(formattedExercises);
  } catch (error) {
    console.error("Exercises error:", error);
    res.status(500).json({ error: "Failed to fetch exercises" });
  }
});

// Words endpoint
router.get("/words", async (req, res) => {
  try {
    const { level, category, limit, german } = req.query;
    let query = {};

    if (level) query.level = level;
    if (category) query.category = category;
    if (german) query.german = german;

    const words = await Word.find(query)
      .limit(parseInt(limit) || 20)
      .sort({ difficulty: 1 });

    const formattedWords = words.map((word) => ({
      id: word._id.toString(),
      german: word.german,
      english: word.english,
      persian: word.persian,
      level: word.level,
      category: word.category,
      difficulty: word.difficulty,
      pronunciation: word.pronunciation,
      examples: word.examples || [],
    }));

    res.json(formattedWords);
  } catch (error) {
    console.error("Words error:", error);
    res.status(500).json({ error: "Failed to fetch words" });
  }
});

// Word by ID endpoint
router.get("/words/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const word = await Word.findById(id);

    if (!word) {
      return res.status(404).json({ error: "Word not found" });
    }

    const formattedWord = {
      id: word._id.toString(),
      german: word.german,
      english: word.english,
      persian: word.persian,
      level: word.level,
      category: word.category,
      difficulty: word.difficulty,
      pronunciation: word.pronunciation,
      examples: word.examples || [],
    };

    res.json(formattedWord);
  } catch (error) {
    console.error("Word by ID error:", error);
    res.status(500).json({ error: "Failed to fetch word" });
  }
});

// Flashcards endpoint
router.get("/flashcards", async (req, res) => {
  try {
    const { type, due } = req.query;
    let query = {};

    if (type) query.type = type;
    if (due === "true") {
      query.nextReview = { $lte: new Date() };
    } else if (due === "false") {
      // When due=false, don't filter by nextReview date
      // This will return all flashcards
    }

    const flashcards = await Flashcard.find(query).sort({ nextReview: 1 });

    const formattedFlashcards = flashcards.map((card) => ({
      id: card._id.toString(),
      front: card.front,
      back: card.back,
      type: card.type,
      difficulty: card.difficulty,
      interval: card.interval,
      repetitions: card.repetitions,
      easeFactor: card.easeFactor,
      nextReview: card.nextReview,
      wordId: card.wordId,
    }));

    res.json(formattedFlashcards);
  } catch (error) {
    console.error("Flashcards error:", error);
    res.status(500).json({ error: "Failed to fetch flashcards" });
  }
});

// Update flashcard endpoint
router.put("/flashcards/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedCard = await Flashcard.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedCard) {
      return res.status(404).json({ error: "Flashcard not found" });
    }

    res.json({
      id: updatedCard._id.toString(),
      front: updatedCard.front,
      back: updatedCard.back,
      type: updatedCard.type,
      difficulty: updatedCard.difficulty,
      interval: updatedCard.interval,
      repetitions: updatedCard.repetitions,
      easeFactor: updatedCard.easeFactor,
      nextReview: updatedCard.nextReview,
      updatedAt: updatedCard.updatedAt,
    });
  } catch (error) {
    console.error("Update flashcard error:", error);
    res.status(500).json({ error: "Failed to update flashcard" });
  }
});

// Exams endpoint
router.get("/exams", async (req, res) => {
  try {
    const { level, category, page = 1, limit = 50 } = req.query;
    let query = { isActive: true };

    if (level) query.level = level;
    if (category) query.topicCategory = category;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const exams = await Exam.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Exam.countDocuments(query);

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
    }));

    res.json({
      exams: formattedExams,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalExams: total,
        hasMore: skip + limitNum < total,
      },
    });
  } catch (error) {
    console.error("Exams error:", error);
    res.status(500).json({ error: "Failed to fetch exams" });
  }
});

// Exam by ID endpoint (with questions)
router.get("/exams/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const exam = await Exam.findById(id);

    if (!exam) {
      return res.status(404).json({ error: "Exam not found" });
    }

    const formattedExam = {
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
      instructions: exam.instructions,
      tags: exam.tags,
    };

    res.json(formattedExam);
  } catch (error) {
    console.error("Exam by ID error:", error);
    res.status(500).json({ error: "Failed to fetch exam" });
  }
});

// Start exam endpoint
router.post("/exams/:id/start", async (req, res) => {
  try {
    const { id } = req.params;

    const exam = await Exam.findById(id);
    if (!exam) {
      return res.status(404).json({ error: "Exam not found" });
    }

    // Create exam session (simplified)
    const session = {
      sessionId: "exam_" + Date.now(),
      examId: id,
      title: exam.title,
      startedAt: new Date(),
      duration: exam.durationMinutes,
      questions: exam.questions,
    };

    res.json(session);
  } catch (error) {
    console.error("Start exam error:", error);
    res.status(500).json({ error: "Failed to start exam" });
  }
});

// Submit exam results
router.post("/exams/:id/submit", async (req, res) => {
  try {
    const { id } = req.params;
    const { answers, timeSpent } = req.body;

    // Calculate score (simplified)
    const exam = await Exam.findById(id);
    if (!exam) {
      return res.status(404).json({ error: "Exam not found" });
    }

    let correctAnswers = 0;
    exam.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });

    const score = (correctAnswers / exam.questions.length) * 100;
    const passed = score >= (exam.passingScore || 70);

    // Update user progress
    await UserProgress.findOneAndUpdate(
      { userId: "current-user" },
      {
        $inc: { totalExams: 1, examAttempts: 1 },
        lastExamScore: score,
        lastExamDate: new Date(),
      },
      { upsert: true }
    );

    res.json({
      score,
      passed,
      correctAnswers,
      totalQuestions: exam.questions.length,
      timeSpent,
      passingScore: exam.passingScore || 70,
    });
  } catch (error) {
    console.error("Submit exam error:", error);
    res.status(500).json({ error: "Failed to submit exam" });
  }
});

// Practice session endpoints
router.post("/practice/start", async (req, res) => {
  try {
    await ensureDB();

    const config = req.body;

    // TODO: Implement actual session creation
    res.json({
      sessionId: "session_" + Date.now(),
      config,
      startedAt: new Date(),
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to start practice session" });
  }
});

router.post("/practice/:sessionId/complete", async (req, res) => {
  try {
    await ensureDB();

    const { sessionId } = req.params;
    const results = req.body;

    // TODO: Implement actual result processing
    res.json({
      sessionId,
      results,
      completedAt: new Date(),
      score: 0.85,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to complete practice session" });
  }
});

// Learning categories endpoint
router.get("/categories", async (req, res) => {
  try {
    await ensureDB();

    const categories = [
      {
        id: "daily",
        name: "Daily Life",
        icon: "house.fill",
        color: "#10B981",
      },
      {
        id: "bureaucracy",
        name: "Bureaucracy",
        icon: "doc.text.fill",
        color: "#3B82F6",
      },
      {
        id: "work",
        name: "Work & Career",
        icon: "briefcase.fill",
        color: "#8B5CF6",
      },
      {
        id: "social",
        name: "Social",
        icon: "person.2.fill",
        color: "#F59E0B",
      },
      {
        id: "health",
        name: "Health",
        icon: "heart.fill",
        color: "#EF4444",
      },
      {
        id: "culture",
        name: "Culture",
        icon: "book.fill",
        color: "#EC4899",
      },
    ];

    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

// Chat endpoint
router.post("/chat", (req, res) => {
  const { message, language } = req.body;

  // TODO: Implement actual chat logic
  res.json({ reply: `Chat response for: ${message}` });
});

// Jobs endpoint
router.get("/jobs", (req, res) => {
  // TODO: Implement actual jobs logic
  res.json({
    version: 1,
    jobs: [],
  });
});

module.exports = router;
