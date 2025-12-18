import DatabaseConfig from "./config/database";
import Exam from "./models/Exam";
import Exercise from "./models/Exercise";
import Flashcard from "./models/Flashcard";
import Grammar from "./models/Grammar";
import UserProgress from "./models/UserProgress";
import Word from "./models/Word";
import DatabaseVersion from "./models/DatabaseVersion";
import { seedDatabase } from "./seed/seedData";

// Export all models
export {
  Exam,
  Exercise,
  Flashcard,
  Grammar,
  UserProgress,
  Word,
  DatabaseVersion,
};

// Export services
export { default as FlashcardService } from "./services/FlashcardService";
export { default as WordService } from "./services/WordService";

// Export database configuration
export { DatabaseConfig };

// Initialize database connection
export const initializeDatabase = async (uri?: string) => {
  try {
    await DatabaseConfig.connect(uri);
    console.log("Database initialized successfully");

    // Optional: Seed database with initial data
    if (
      process.env.NODE_ENV === "development" ||
      process.env.SEED_DB === "true"
    ) {
      await seedDatabase();
    }

    return true;
  } catch (error) {
    console.error("Failed to initialize database:", error);
    return false;
  }
};

// Graceful shutdown
export const closeDatabase = async () => {
  try {
    await DatabaseConfig.disconnect();
    console.log("Database connection closed");
  } catch (error) {
    console.error("Error closing database:", error);
  }
};

export default {
  models: {
    Word,
    Grammar,
    Flashcard,
    Exercise,
    Exam,
    UserProgress,
  },
  services: {
    WordService: require("./services/WordService").default,
    FlashcardService: require("./services/FlashcardService").default,
  },
  config: DatabaseConfig,
  initialize: initializeDatabase,
  close: closeDatabase,
};
