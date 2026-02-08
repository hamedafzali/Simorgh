const SQLiteGenerator = require("../../admin/src/scripts/sqlite-generator");
const path = require("path");

async function main() {
  try {
    console.log("Starting SQLite database generation...");

    // Get environment variables
    const wordsCount = parseInt(process.env.WORDS_COUNT) || 1000;
    const flashcardsCount = parseInt(process.env.FLASHCARDS_COUNT) || 2000;
    const examsCount = parseInt(process.env.EXAMS_COUNT) || 500;
    const levels = (process.env.LEVELS || "A1,A2,B1").split(",");
    const dbVersion = process.env.DB_VERSION || "1.0.0";

    console.log(`Configuration:
    - Words: ${wordsCount}
    - Flashcards: ${flashcardsCount}
    - Exams: ${examsCount}
    - Levels: ${levels.join(", ")}
    - Version: ${dbVersion}`);

    // Initialize and run the SQLite generator
    const generator = new SQLiteGenerator();

    // Set the version from environment variable
    generator.dbVersion = dbVersion;

    // Generate the database
    const stats = await generator.generateDatabase();

    console.log("Database generation completed successfully!");
    console.log(`Database version: ${dbVersion}`);
    console.log(`Generated stats:`, stats);

    // Output success message that can be parsed by the parent process
    console.log(`Database version: ${dbVersion}`);
  } catch (error) {
    console.error("Database generation failed:", error);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (require.main === module) {
  main();
}

module.exports = { main };
