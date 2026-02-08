const mongoose = require("mongoose");
const Flashcard = require("../../database/models/Flashcard");
const Word = require("../../database/models/Word");

const linkFlashcardsToWords = async () => {
  try {
    console.log("Starting flashcard-to-word linking process...");

    // Get all words
    const words = await Word.find({});
    console.log(`Found ${words.length} words in database`);

    // Get all flashcards
    const flashcards = await Flashcard.find({});
    console.log(`Found ${flashcards.length} flashcards in database`);

    // Link each flashcard to a matching word
    const updatedFlashcards = [];

    for (const flashcard of flashcards) {
      // Find a word with the same german text
      const matchingWord = words.find(
        (word) => word.german === flashcard.front
      );

      if (matchingWord) {
        // Update flashcard with wordId
        await Flashcard.updateOne(
          { _id: flashcard._id },
          { wordId: matchingWord._id }
        );
        updatedFlashcards.push({
          flashcard: flashcard.front,
          wordId: matchingWord._id,
          hasExamples:
            matchingWord.examples && matchingWord.examples.length > 0,
        });
      } else {
        // If no exact match, try partial match
        const partialMatch = words.find(
          (word) =>
            word.german.includes(flashcard.front) ||
            flashcard.front.includes(word.german)
        );

        if (partialMatch) {
          await Flashcard.updateOne(
            { _id: flashcard._id },
            { wordId: partialMatch._id }
          );
          updatedFlashcards.push({
            flashcard: flashcard.front,
            wordId: partialMatch._id,
            hasExamples:
              partialMatch.examples && partialMatch.examples.length > 0,
            matchType: "partial",
          });
        }
      }
    }

    console.log(
      `Successfully linked ${updatedFlashcards.length} flashcards to words!`
    );

    // Show some examples
    console.log("\nSample linked flashcards:");
    updatedFlashcards.slice(0, 5).forEach((link) => {
      console.log(
        `- "${link.flashcard}" -> wordId: ${link.wordId}, has examples: ${link.hasExamples}`
      );
    });

    return updatedFlashcards.length;
  } catch (error) {
    console.error("Error linking flashcards to words:", error);
    return 0;
  }
};

module.exports = linkFlashcardsToWords;
