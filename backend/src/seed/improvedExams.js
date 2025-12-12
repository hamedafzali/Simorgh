const mongoose = require("mongoose");
const Exam = require("../../database/models/Exam");

const createImprovedGermanExams = async () => {
  try {
    // Clear existing exams
    await Exam.deleteMany({});

    const improvedExams = [
      {
        title: "German A1 Comprehensive Assessment",
        description:
          "Complete A1 level German test covering greetings, basic grammar, vocabulary, and everyday situations",
        level: "A1",
        topicCategory: "comprehensive",
        durationMinutes: 30,
        questions: [
          // Greetings and Introductions
          {
            question: "Wie heißt du? (What's your name?)",
            questionData: null,
            options: [
              "Ich heiße...",
              "Du heißt...",
              "Er heißt...",
              "Sie heißt...",
            ],
            correctAnswer: 0,
            explanation:
              "'Ich heiße...' means 'My name is...' and is the correct response to 'Wie heißt du?'",
            points: 5,
            orderIndex: 0,
          },
          {
            question: "Choose the correct greeting for the evening",
            questionData: null,
            options: ["Guten Morgen", "Guten Tag", "Guten Abend", "Gute Nacht"],
            correctAnswer: 2,
            explanation: "'Guten Abend' is used for evening greetings",
            points: 5,
            orderIndex: 1,
          },
          {
            question: "What is 'Thank you' in German?",
            questionData: null,
            options: ["Bitte", "Danke", "Entschuldigung", "Tschüss"],
            correctAnswer: 1,
            explanation: "'Danke' means 'Thank you' in German",
            points: 5,
            orderIndex: 2,
          },

          // Basic Grammar - 'sein' (to be)
          {
            question: "Complete: Ich ___ müde (I ___ tired)",
            questionData: { blankPosition: 1 },
            options: ["bin", "bist", "ist", "sind"],
            correctAnswer: 0,
            explanation: "For 'ich' (I), the correct form of 'sein' is 'bin'",
            points: 5,
            orderIndex: 3,
          },
          {
            question: "Complete: Du ___ Student (You ___ a student)",
            questionData: { blankPosition: 1 },
            options: ["bin", "bist", "ist", "sind"],
            correctAnswer: 1,
            explanation:
              "For 'du' (you, informal), the correct form of 'sein' is 'bist'",
            points: 5,
            orderIndex: 4,
          },
          {
            question: "Complete: Er ___ Lehrer (He ___ a teacher)",
            questionData: { blankPosition: 1 },
            options: ["bin", "bist", "ist", "sind"],
            correctAnswer: 2,
            explanation: "For 'er' (he), the correct form of 'sein' is 'ist'",
            points: 5,
            orderIndex: 5,
          },

          // Basic Grammar - 'haben' (to have)
          {
            question: "Complete: Ich ___ ein Buch (I ___ a book)",
            questionData: { blankPosition: 1 },
            options: ["habe", "hast", "hat", "haben"],
            correctAnswer: 0,
            explanation: "For 'ich' (I), the correct form of 'haben' is 'habe'",
            points: 5,
            orderIndex: 6,
          },
          {
            question: "Complete: Sie ___ einen Hund (They ___ a dog)",
            questionData: { blankPosition: 1 },
            options: ["habe", "hast", "hat", "haben"],
            correctAnswer: 3,
            explanation:
              "For 'Sie' (they), the correct form of 'haben' is 'haben'",
            points: 5,
            orderIndex: 7,
          },

          // Articles and Nouns
          {
            question:
              "Choose the correct article for 'Tisch' (table) - masculine",
            questionData: null,
            options: ["das", "die", "der", "den"],
            correctAnswer: 2,
            explanation:
              "'der' is the definite article for masculine nouns like 'Tisch'",
            points: 5,
            orderIndex: 8,
          },
          {
            question: "Choose the correct article for 'Tür' (door) - feminine",
            questionData: null,
            options: ["das", "die", "der", "den"],
            correctAnswer: 1,
            explanation:
              "'die' is the definite article for feminine nouns like 'Tür'",
            points: 5,
            orderIndex: 9,
          },
          {
            question: "Choose the correct article for 'Buch' (book) - neuter",
            questionData: null,
            options: ["das", "die", "der", "den"],
            correctAnswer: 0,
            explanation:
              "'das' is the definite article for neuter nouns like 'Buch'",
            points: 5,
            orderIndex: 10,
          },

          // Basic Vocabulary
          {
            question: "What does 'groß' mean?",
            questionData: null,
            options: ["small", "big", "good", "bad"],
            correctAnswer: 1,
            explanation: "'groß' means 'big' or 'large' in German",
            points: 5,
            orderIndex: 11,
          },
          {
            question: "What does 'klein' mean?",
            questionData: null,
            options: ["small", "big", "good", "bad"],
            correctAnswer: 0,
            explanation: "'klein' means 'small' or 'little' in German",
            points: 5,
            orderIndex: 12,
          },
          {
            question: "What does 'gut' mean?",
            questionData: null,
            options: ["small", "big", "good", "bad"],
            correctAnswer: 2,
            explanation: "'gut' means 'good' in German",
            points: 5,
            orderIndex: 13,
          },

          // Everyday Situations
          {
            question: "How do you ask 'Where is the train station?'",
            questionData: null,
            options: [
              "Wo ist der Bahnhof?",
              "Wo ist die Schule?",
              "Wo ist das Haus?",
              "Wo ist das Buch?",
            ],
            correctAnswer: 0,
            explanation:
              "'Wo ist der Bahnhof?' means 'Where is the train station?'",
            points: 5,
            orderIndex: 14,
          },
          {
            question: "How do you say 'I don't understand'?",
            questionData: null,
            options: [
              "Ich verstehe nicht",
              "Ich spreche nicht",
              "Ich höre nicht",
              "Ich sehe nicht",
            ],
            correctAnswer: 0,
            explanation: "'Ich verstehe nicht' means 'I don't understand'",
            points: 5,
            orderIndex: 15,
          },

          // Numbers and Time
          {
            question: "What number is 'drei'?",
            questionData: null,
            options: ["one", "two", "three", "four"],
            correctAnswer: 2,
            explanation: "'drei' means 'three' in German",
            points: 5,
            orderIndex: 16,
          },
          {
            question: "What time is 'zwölf Uhr'?",
            questionData: null,
            options: ["10 o'clock", "11 o'clock", "12 o'clock", "1 o'clock"],
            correctAnswer: 2,
            explanation: "'zwölf Uhr' means '12 o'clock'",
            points: 5,
            orderIndex: 17,
          },
        ],
        instructions:
          "Read each question carefully and select the best answer. You have 30 minutes to complete all 18 questions.",
        passingScore: 70,
        maxAttempts: 3,
        tags: ["assessment", "comprehensive", "A1", "grammar", "vocabulary"],
        isActive: true,
      },

      {
        title: "German Grammar Focus - Verbs",
        description: "Focused test on German verb conjugations and usage",
        level: "A1",
        topicCategory: "grammar",
        durationMinutes: 20,
        questions: [
          {
            question: "Complete: Wir ___ nach Berlin (We ___ to Berlin)",
            questionData: { blankPosition: 1 },
            options: ["gehen", "geht", "gehe", "gehst"],
            correctAnswer: 0,
            explanation:
              "For 'wir' (we), the correct form of 'gehen' is 'gehen'",
            points: 10,
            orderIndex: 0,
          },
          {
            question: "Complete: Sie ___ Deutsch (They ___ German)",
            questionData: { blankPosition: 1 },
            options: ["sprechen", "sprichst", "spricht", "sprecht"],
            correctAnswer: 3,
            explanation:
              "For 'Sie' (they), the correct form of 'sprechen' is 'sprechen' (same as infinitive)",
            points: 10,
            orderIndex: 1,
          },
          {
            question: "Complete: Ich ___ Kaffee (I ___ coffee)",
            questionData: { blankPosition: 1 },
            options: ["trinken", "trinkst", "trinke", "trinkt"],
            correctAnswer: 2,
            explanation:
              "For 'ich' (I), the correct form of 'trinken' is 'trinke'",
            points: 10,
            orderIndex: 2,
          },
          {
            question: "Complete: Du ___ Pizza (You ___ pizza)",
            questionData: { blankPosition: 1 },
            options: ["isst", "esse", "isst", "essen"],
            correctAnswer: 0,
            explanation:
              "For 'du' (you, informal), the correct form of 'essen' is 'isst'",
            points: 10,
            orderIndex: 3,
          },
          {
            question: "Complete: Er ___ Musik (He ___ music)",
            questionData: { blankPosition: 1 },
            options: ["höre", "hörst", "hört", "hören"],
            correctAnswer: 2,
            explanation: "For 'er' (he), the correct form of 'hören' is 'hört'",
            points: 10,
            orderIndex: 4,
          },
        ],
        instructions:
          "Focus on verb conjugations for different pronouns. Complete each sentence with the correct verb form.",
        passingScore: 75,
        maxAttempts: 3,
        tags: ["grammar", "verbs", "conjugation", "A1"],
        isActive: true,
      },
    ];

    await Exam.insertMany(improvedExams);
    console.log(
      `Successfully created ${improvedExams.length} improved German exams!`
    );

    return improvedExams.length;
  } catch (error) {
    console.error("Error creating improved exams:", error);
    return 0;
  }
};

module.exports = createImprovedGermanExams;
