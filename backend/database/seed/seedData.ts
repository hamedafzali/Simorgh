import Exam from "../models/Exam";
import Exercise from "../models/Exercise";
import Grammar from "../models/Grammar";
import Word from "../models/Word";

export const seedWords = async () => {
  const words = [
    // A1 Wörter
    {
      word: "Haus",
      article: "das",
      wordType: "noun",
      level: "A1",
      frequencyScore: 9.5,
      translations: [
        { language: "en", text: "house", isPrimary: true },
        { language: "en", text: "home", isPrimary: false },
      ],
      definitions: [
        {
          text: "Gebäude zum Wohnen",
          example: "Ich wohne in einem großen Haus.",
          level: "A1",
        },
      ],
      tags: ["wohnung", "gebäude", "alltag"],
    },
    {
      word: "sein",
      article: "",
      wordType: "verb",
      level: "A1",
      frequencyScore: 10,
      translations: [{ language: "en", text: "to be", isPrimary: true }],
      conjugations: [
        { tense: "present", person: "ich", form: "bin" },
        { tense: "present", person: "du", form: "bist" },
        { tense: "present", person: "er/sie/es", form: "ist" },
        { tense: "present", person: "wir", form: "sind" },
        { tense: "present", person: "ihr", form: "seid" },
        { tense: "present", person: "sie/Sie", form: "sind" },
      ],
      tags: ["grundverben", "grammatik"],
    },
    {
      word: "gut",
      article: "",
      wordType: "adjective",
      level: "A1",
      frequencyScore: 8.8,
      translations: [{ language: "en", text: "good", isPrimary: true }],
      definitions: [
        {
          text: "von hoher Qualität",
          example: "Das Essen ist sehr gut.",
          level: "A1",
        },
      ],
      tags: ["adjektive", "qualität"],
    },
    // A2 Wörter
    {
      word: "Arbeit",
      article: "die",
      wordType: "noun",
      level: "A2",
      frequencyScore: 8.2,
      translations: [
        { language: "en", text: "work", isPrimary: true },
        { language: "en", text: "job", isPrimary: false },
      ],
      definitions: [
        {
          text: "Berufliche Tätigkeit",
          example: "Ich gehe jeden Tag zur Arbeit.",
          level: "A2",
        },
      ],
      tags: ["beruf", "alltag"],
    },
    {
      word: "mögen",
      article: "",
      wordType: "verb",
      level: "A2",
      frequencyScore: 7.9,
      translations: [{ language: "en", text: "to like", isPrimary: true }],
      conjugations: [
        { tense: "present", person: "ich", form: "mag" },
        { tense: "present", person: "du", form: "magst" },
        { tense: "present", person: "er/sie/es", form: "mag" },
        { tense: "present", person: "wir", form: "mögen" },
        { tense: "present", person: "ihr", form: "mögt" },
        { tense: "present", person: "sie/Sie", form: "mögen" },
      ],
      tags: ["verben", "vorlieben"],
    },
  ];

  try {
    await Word.insertMany(words);
    console.log("Words seeded successfully");
  } catch (error) {
    console.error("Error seeding words:", error);
  }
};

export const seedGrammar = async () => {
  const grammarTopics = [
    {
      title: "Präsens - Regelmäßige Verben",
      description: "Die Bildung des Präsens bei regelmäßigen Verben",
      level: "A1",
      category: "verbs",
      difficultyScore: 2,
      rules: [
        {
          name: "Standardkonjugation",
          description: "Stamm + Endung",
          formula: "Infinitivstamm + Personalendung",
          examples: ["ich spiel-e", "du spiel-st", "er/sie/es spiel-t"],
          level: "A1",
        },
      ],
      tags: ["präsens", "verben", "konjugation"],
    },
    {
      title: "Perfekt mit haben",
      description: "Die Bildung des Perfekts mit dem Hilfsverb haben",
      level: "A2",
      category: "tenses",
      difficultyScore: 4,
      rules: [
        {
          name: "Perfekt-Struktur",
          description: "haben/sein + Partizip Perfekt",
          formula: "Subjekt + haben/sein + Partizip Perfekt + Objekt",
          examples: ["Ich habe gegessen.", "Er ist gegangen."],
          level: "A2",
        },
      ],
      tags: ["perfekt", "vergangenheit", "hilfsverben"],
    },
  ];

  try {
    await Grammar.insertMany(grammarTopics);
    console.log("Grammar topics seeded successfully");
  } catch (error) {
    console.error("Error seeding grammar:", error);
  }
};

export const seedExercises = async () => {
  const exercises = [
    {
      title: "Artikel bestimmen",
      description: "Bestimme den richtigen Artikel für die Substantive",
      exerciseType: "multiple_choice",
      level: "A1",
      topicCategory: "articles",
      difficultyScore: 2,
      timeLimitMinutes: 5,
      instructions: "Wähle den richtigen Artikel für jedes Substantiv.",
      questions: [
        {
          question: "___ Haus",
          options: ["Der", "Die", "Das"],
          correctAnswer: 2,
          explanation: 'Haus ist sächlich, deshalb verwenden wir "das".',
          points: 1,
          orderIndex: 0,
        },
        {
          question: "___ Frau",
          options: ["Der", "Die", "Das"],
          correctAnswer: 1,
          explanation: 'Frau ist weiblich, deshalb verwenden wir "die".',
          points: 1,
          orderIndex: 1,
        },
      ],
      tags: ["artikel", "substantive", "grammatik"],
    },
    {
      title: "Verben konjugieren",
      description: "Konjugiere die Verben im Präsens",
      exerciseType: "fill_blank",
      level: "A1",
      topicCategory: "verbs",
      difficultyScore: 3,
      timeLimitMinutes: 10,
      instructions: "Fülle die Lücken mit der richtigen Verbform.",
      questions: [
        {
          question: "Ich ___ (kommen) aus Deutschland.",
          correctAnswer: "komme",
          explanation: "1. Person Singular: ich komme",
          points: 1,
          orderIndex: 0,
        },
        {
          question: "Du ___ (sein) müde.",
          correctAnswer: "bist",
          explanation: "2. Person Singular von sein: du bist",
          points: 1,
          orderIndex: 1,
        },
      ],
      tags: ["verben", "konjugation", "präsens"],
    },
  ];

  try {
    await Exercise.insertMany(exercises);
    console.log("Exercises seeded successfully");
  } catch (error) {
    console.error("Error seeding exercises:", error);
  }
};

export const seedExams = async () => {
  const exams = [
    {
      title: "A1 Grundlagen Test",
      description: "Test für grundlegende Deutschkenntnisse (A1-Niveau)",
      level: "A1",
      examType: "practice",
      durationMinutes: 30,
      passingScore: 70,
      instructions: "Dieser Test prüft deine grundlegenden Deutschkenntnisse.",
      sections: [
        {
          title: "Vokabular",
          sectionType: "vocabulary",
          durationMinutes: 10,
          questionCount: 10,
          weightPercentage: 30,
          orderIndex: 0,
          exercises: [],
        },
        {
          title: "Grammatik",
          sectionType: "grammar",
          durationMinutes: 15,
          questionCount: 15,
          weightPercentage: 50,
          orderIndex: 1,
          exercises: [],
        },
        {
          title: "Leseverständnis",
          sectionType: "reading",
          durationMinutes: 5,
          questionCount: 5,
          weightPercentage: 20,
          orderIndex: 2,
          exercises: [],
        },
      ],
      tags: ["a1", "grundlagen", "test"],
    },
  ];

  try {
    await Exam.insertMany(exams);
    console.log("Exams seeded successfully");
  } catch (error) {
    console.error("Error seeding exams:", error);
  }
};

export const seedDatabase = async () => {
  console.log("Starting database seeding...");

  await seedWords();
  await seedGrammar();
  await seedExercises();
  await seedExams();

  console.log("Database seeding completed!");
};
