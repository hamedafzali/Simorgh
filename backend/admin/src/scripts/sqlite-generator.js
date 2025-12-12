// SQLite Database Generator for Mobile App
// This script generates SQLite database files from MongoDB data

const sqlite3 = require("sqlite3").verbose();
const fs = require("fs").promises;
const path = require("path");
const mongoose = require("mongoose");

// MongoDB Models
const Exam = require("../../../database/models/Exam");
const Flashcard = require("../../../database/models/Flashcard");
const Word = require("../../../database/models/Word");

class SQLiteGenerator {
  constructor() {
    this.db = null;
    this.outputDir = path.join(__dirname, "../../dist/sqlite");
  }

  async initialize() {
    try {
      // Ensure output directory exists
      await fs.mkdir(this.outputDir, { recursive: true });

      // Connect to MongoDB
      await mongoose.connect(
        process.env.MONGODB_URI || "mongodb://localhost:27017/simorgh"
      );
      console.log("Connected to MongoDB");

      // Initialize SQLite database
      const dbPath = path.join(this.outputDir, "simorgh_app.db");
      this.db = new sqlite3.Database(dbPath);

      console.log("SQLite database initialized at:", dbPath);
    } catch (error) {
      console.error("Initialization failed:", error);
      throw error;
    }
  }

  async createTables() {
    const tables = {
      database_version: `
        CREATE TABLE IF NOT EXISTS database_version (
          id INTEGER PRIMARY KEY CHECK (id = 1),
          version TEXT NOT NULL,
          timestamp INTEGER NOT NULL,
          description TEXT
        )
      `,
      exams: `
        CREATE TABLE IF NOT EXISTS exams (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          description TEXT,
          level TEXT NOT NULL,
          category TEXT NOT NULL,
          duration INTEGER NOT NULL,
          question_count INTEGER NOT NULL,
          passing_score INTEGER NOT NULL,
          max_attempts INTEGER NOT NULL,
          instructions TEXT,
          questions TEXT NOT NULL,
          is_active INTEGER DEFAULT 1,
          created_at INTEGER NOT NULL,
          updated_at INTEGER NOT NULL
        )
      `,
      flashcards: `
        CREATE TABLE IF NOT EXISTS flashcards (
          id TEXT PRIMARY KEY,
          front TEXT NOT NULL,
          back TEXT NOT NULL,
          type TEXT DEFAULT 'general',
          level TEXT DEFAULT 'A1',
          category TEXT DEFAULT 'general',
          next_review INTEGER NOT NULL,
          review_count INTEGER DEFAULT 0,
          difficulty INTEGER DEFAULT 1,
          created_at INTEGER NOT NULL,
          updated_at INTEGER NOT NULL
        )
      `,
      words: `
        CREATE TABLE IF NOT EXISTS words (
          id TEXT PRIMARY KEY,
          german TEXT NOT NULL,
          english TEXT NOT NULL,
          category TEXT DEFAULT 'general',
          level TEXT DEFAULT 'A1',
          frequency INTEGER DEFAULT 1,
          examples TEXT,
          created_at INTEGER NOT NULL,
          updated_at INTEGER NOT NULL
        )
      `,
      user_settings: `
        CREATE TABLE IF NOT EXISTS user_settings (
          id INTEGER PRIMARY KEY CHECK (id = 1),
          preferred_language TEXT DEFAULT 'en',
          notifications_enabled INTEGER DEFAULT 1,
          study_reminders INTEGER DEFAULT 1,
          location_most_recent TEXT,
          theme TEXT DEFAULT 'auto',
          created_at INTEGER NOT NULL,
          updated_at INTEGER NOT NULL
        )
      `,
      exam_results: `
        CREATE TABLE IF NOT EXISTS exam_results (
          id TEXT PRIMARY KEY,
          exam_id TEXT NOT NULL,
          user_id TEXT,
          score INTEGER NOT NULL,
          total_questions INTEGER NOT NULL,
          time_taken INTEGER NOT NULL,
          answers TEXT NOT NULL,
          completed_at INTEGER NOT NULL,
          FOREIGN KEY (exam_id) REFERENCES exams(id)
        )
      `,
    };

    for (const [tableName, query] of Object.entries(tables)) {
      await new Promise((resolve, reject) => {
        this.db.run(query, (err) => {
          if (err) reject(err);
          else {
            console.log(`Created table: ${tableName}`);
            resolve();
          }
        });
      });
    }
  }

  async insertDatabaseVersion() {
    const version = {
      version: "1.0.0",
      timestamp: Date.now(),
      description: "Initial SQLite database for mobile app",
    };

    await new Promise((resolve, reject) => {
      this.db.run(
        `INSERT OR REPLACE INTO database_version (id, version, timestamp, description) VALUES (1, ?, ?, ?)`,
        [version.version, version.timestamp, version.description],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    console.log("Database version inserted");
  }

  async insertExams() {
    const exams = await Exam.find({ isActive: true });

    for (const exam of exams) {
      const examData = {
        id: exam._id.toString(),
        title: exam.title,
        description: exam.description,
        level: exam.level,
        category: exam.topicCategory,
        duration: exam.durationMinutes,
        question_count: exam.questions.length,
        passing_score: exam.passingScore,
        max_attempts: exam.maxAttempts,
        instructions:
          exam.instructions ||
          `Complete all ${exam.questions.length} questions to the best of your ability. You have ${exam.durationMinutes} minutes.`,
        questions: JSON.stringify(exam.questions),
        is_active: exam.isActive ? 1 : 0,
        created_at: exam.createdAt.getTime(),
        updated_at: exam.updatedAt.getTime(),
      };

      await new Promise((resolve, reject) => {
        this.db.run(
          `INSERT OR REPLACE INTO exams (
            id, title, description, level, category, duration, question_count,
            passing_score, max_attempts, instructions, questions, is_active,
            created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            examData.id,
            examData.title,
            examData.description,
            examData.level,
            examData.category,
            examData.duration,
            examData.question_count,
            examData.passing_score,
            examData.max_attempts,
            examData.instructions,
            examData.questions,
            examData.is_active,
            examData.created_at,
            examData.updated_at,
          ],
          (err) => {
            if (err) reject(err);
            else resolve();
          }
        );
      });
    }

    console.log(`Inserted ${exams.length} exams`);
  }

  async insertFlashcards() {
    const flashcards = await Flashcard.find();

    for (const card of flashcards) {
      const cardData = {
        id: card._id.toString(),
        front: card.front,
        back: card.back,
        type: card.type || "general",
        level: card.level || "A1",
        category: card.category || "general",
        next_review: card.nextReview || Date.now(),
        review_count: card.reviewCount || 0,
        difficulty: card.difficulty || 1,
        created_at: card.createdAt.getTime(),
        updated_at: card.updatedAt.getTime(),
      };

      await new Promise((resolve, reject) => {
        this.db.run(
          `INSERT OR REPLACE INTO flashcards (
            id, front, back, type, level, category, next_review,
            review_count, difficulty, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            cardData.id,
            cardData.front,
            cardData.back,
            cardData.type,
            cardData.level,
            cardData.category,
            cardData.next_review,
            cardData.review_count,
            cardData.difficulty,
            cardData.created_at,
            cardData.updated_at,
          ],
          (err) => {
            if (err) reject(err);
            else resolve();
          }
        );
      });
    }

    console.log(`Inserted ${flashcards.length} flashcards`);
  }

  async insertWords() {
    const words = await Word.find();

    for (const word of words) {
      const wordData = {
        id: word._id.toString(),
        german: word.german,
        english: word.english,
        category: word.category || "general",
        level: word.level || "A1",
        frequency: word.frequency || 1,
        examples: JSON.stringify(word.examples || []),
        created_at: word.createdAt.getTime(),
        updated_at: word.updatedAt.getTime(),
      };

      await new Promise((resolve, reject) => {
        this.db.run(
          `INSERT OR REPLACE INTO words (
            id, german, english, category, level, frequency, examples,
            created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            wordData.id,
            wordData.german,
            wordData.english,
            wordData.category,
            wordData.level,
            wordData.frequency,
            wordData.examples,
            wordData.created_at,
            wordData.updated_at,
          ],
          (err) => {
            if (err) reject(err);
            else resolve();
          }
        );
      });
    }

    console.log(`Inserted ${words.length} words`);
  }

  async insertDefaultUserSettings() {
    const defaultSettings = {
      preferred_language: "en",
      notifications_enabled: 1,
      study_reminders: 1,
      location_most_recent: null,
      theme: "auto",
      created_at: Date.now(),
      updated_at: Date.now(),
    };

    await new Promise((resolve, reject) => {
      this.db.run(
        `INSERT OR REPLACE INTO user_settings (
          id, preferred_language, notifications_enabled, study_reminders,
          location_most_recent, theme, created_at, updated_at
        ) VALUES (1, ?, ?, ?, ?, ?, ?, ?)`,
        [
          defaultSettings.preferred_language,
          defaultSettings.notifications_enabled,
          defaultSettings.study_reminders,
          defaultSettings.location_most_recent,
          defaultSettings.theme,
          defaultSettings.created_at,
          defaultSettings.updated_at,
        ],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    console.log("Default user settings inserted");
  }

  async createIndexes() {
    const indexes = [
      "CREATE INDEX IF NOT EXISTS idx_exams_category ON exams(category)",
      "CREATE INDEX IF NOT EXISTS idx_exams_level ON exams(level)",
      "CREATE INDEX IF NOT EXISTS idx_flashcards_type ON flashcards(type)",
      "CREATE INDEX IF NOT EXISTS idx_flashcards_level ON flashcards(level)",
      "CREATE INDEX IF NOT EXISTS idx_flashcards_next_review ON flashcards(next_review)",
      "CREATE INDEX IF NOT EXISTS idx_words_category ON words(category)",
      "CREATE INDEX IF NOT EXISTS idx_words_level ON words(level)",
      "CREATE INDEX IF NOT EXISTS idx_exam_results_exam_id ON exam_results(exam_id)",
      "CREATE INDEX IF NOT EXISTS idx_exam_results_completed_at ON exam_results(completed_at)",
    ];

    for (const indexQuery of indexes) {
      await new Promise((resolve, reject) => {
        this.db.run(indexQuery, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    }

    console.log("Database indexes created");
  }

  async generateDatabase() {
    try {
      console.log("Starting SQLite database generation...");

      await this.initialize();
      await this.createTables();
      await this.insertDatabaseVersion();
      await this.insertExams();
      await this.insertFlashcards();
      await this.insertWords();
      await this.insertDefaultUserSettings();
      await this.createIndexes();

      console.log("SQLite database generation completed successfully!");

      // Get database stats before closing
      const stats = await this.getDatabaseStats();
      console.log("Database Stats:", stats);

      return stats;
    } catch (error) {
      console.error("Database generation failed:", error);
      throw error;
    } finally {
      // Close database only after getting stats
      if (this.db) {
        this.db.close();
        this.db = null;
      }
      if (mongoose.connection.readyState === 1) {
        await mongoose.disconnect();
      }
    }
  }

  async getDatabaseStats() {
    return new Promise((resolve, reject) => {
      const queries = [
        "SELECT COUNT(*) as count FROM exams",
        "SELECT COUNT(*) as count FROM flashcards",
        "SELECT COUNT(*) as count FROM words",
      ];

      const stats = {};
      let completed = 0;

      queries.forEach((query, index) => {
        this.db.get(query, (err, row) => {
          if (err) {
            reject(err);
            return;
          }

          if (index === 0) stats.exams = row.count;
          else if (index === 1) stats.flashcards = row.count;
          else if (index === 2) stats.words = row.count;

          completed++;
          if (completed === queries.length) {
            resolve(stats);
          }
        });
      });
    });
  }

  async packageDatabase() {
    const packagePath = path.join(this.outputDir, "simorgh-app-package.json");

    // Re-open database to get stats
    const dbPath = path.join(this.outputDir, "simorgh_app.db");
    const tempDb = new sqlite3.Database(dbPath);

    const stats = await new Promise((resolve, reject) => {
      const queries = [
        "SELECT COUNT(*) as count FROM exams",
        "SELECT COUNT(*) as count FROM flashcards",
        "SELECT COUNT(*) as count FROM words",
      ];

      const stats = {};
      let completed = 0;

      queries.forEach((query, index) => {
        tempDb.get(query, (err, row) => {
          if (err) {
            reject(err);
            return;
          }

          if (index === 0) stats.exams = row.count;
          else if (index === 1) stats.flashcards = row.count;
          else if (index === 2) stats.words = row.count;

          completed++;
          if (completed === queries.length) {
            tempDb.close();
            resolve(stats);
          }
        });
      });
    });

    const packageInfo = {
      version: "1.0.0",
      timestamp: Date.now(),
      database_file: "simorgh_app.db",
      description: "Simorgh German Learning App - SQLite Database Package",
      stats: stats,
      compatibility: {
        min_app_version: "1.0.0",
        platform: "react-native",
      },
    };

    await fs.writeFile(packagePath, JSON.stringify(packageInfo, null, 2));
    console.log("Database package created:", packagePath);

    return packageInfo;
  }
}

// Export for use in admin panel
module.exports = SQLiteGenerator;

// CLI usage
if (require.main === module) {
  const generator = new SQLiteGenerator();
  generator
    .generateDatabase()
    .then(() => generator.packageDatabase())
    .then(() => {
      console.log("SQLite database generation and packaging complete!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Failed:", error);
      process.exit(1);
    });
}
