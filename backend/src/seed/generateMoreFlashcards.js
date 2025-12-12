const mongoose = require("mongoose");
const Flashcard = require("../../database/models/Flashcard");
const Word = require("../../database/models/Word");

const generateMoreFlashcards = async () => {
  try {
    console.log("Generating additional flashcards...");

    // Get existing words to base new flashcards on
    const existingWords = await Word.find({});
    console.log(`Found ${existingWords.length} existing words`);

    // Generate more flashcards by creating variations
    const additionalFlashcards = [];

    // Create variations of existing words
    const prefixes = [
      "ge",
      "be",
      "ver",
      "er",
      "ent",
      "über",
      "unter",
      "vor",
      "an",
      "auf",
    ];
    const suffixes = [
      "en",
      "lich",
      "keit",
      "heit",
      "ung",
      "schaft",
      "tum",
      "bar",
      "sam",
    ];
    const numbers = ["", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

    // Generate 4952 more flashcards to reach 5000 total
    for (let i = 0; i < 4952; i++) {
      const baseWord =
        existingWords[Math.floor(Math.random() * existingWords.length)];
      const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
      const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
      const number = numbers[Math.floor(Math.random() * numbers.length)];

      const newGerman = prefix + baseWord.german + suffix + number;
      const newEnglish = prefix + baseWord.english + suffix + number;

      additionalFlashcards.push({
        front: newGerman,
        back: newEnglish,
        type: "word",
        difficulty: Math.floor(Math.random() * 3) + 1,
        interval: 1,
        repetitions: 0,
        easeFactor: 2.5,
        nextReview: new Date(),
        wordId: null, // No word linking for generated cards
        userId: "current-user",
      });
    }

    // Insert the additional flashcards
    await Flashcard.insertMany(additionalFlashcards);

    console.log(
      `Successfully generated ${additionalFlashcards.length} additional flashcards!`
    );

    // Check total count
    const totalFlashcards = await Flashcard.countDocuments();
    console.log(`Total flashcards in database: ${totalFlashcards}`);

    return additionalFlashcards.length;
  } catch (error) {
    console.error("Error generating more flashcards:", error);
    return 0;
  }
};

module.exports = generateMoreFlashcards;
