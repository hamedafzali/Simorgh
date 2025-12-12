const mongoose = require("mongoose");
const Word = require("../../database/models/Word");
const Exercise = require("../../database/models/Exercise");
const Flashcard = require("../../database/models/Flashcard");
const Exam = require("../../database/models/Exam");
const UserProgress = require("../../database/models/UserProgress");

const seedDatabase = async () => {
  try {
    // Clear existing data
    await Word.deleteMany({});
    await Exercise.deleteMany({});
    await Flashcard.deleteMany({});
    await Exam.deleteMany({});
    await UserProgress.deleteMany({});

    // Seed Words
    const words = [
      {
        german: "Hallo",
        english: "Hello",
        persian: "سلام",
        level: "A1",
        category: "greetings",
        difficulty: 1,
        pronunciation: "HAH-loh",
        audioUrl: "",
        imageUrl: "",
        tags: ["basic", "common"],
        examples: [
          {
            german: "Hallo, wie geht es dir?",
            english: "Hello, how are you?",
            persian: "سلام، حال شما چطور است؟",
          },
          {
            german: "Guten Tag, hallo!",
            english: "Good day, hello!",
            persian: "روز بخیر، سلام!",
          },
        ],
      },
      {
        german: "Danke",
        english: "Thank you",
        persian: "متشکرم",
        level: "A1",
        category: "greetings",
        difficulty: 1,
        pronunciation: "DAHN-keh",
        audioUrl: "",
        imageUrl: "",
        tags: ["basic", "polite"],
        examples: [
          {
            german: "Vielen Dank!",
            english: "Thank you very much!",
            persian: "خیلی متشکرم!",
          },
          {
            german: "Danke für deine Hilfe",
            english: "Thanks for your help",
            persian: "ممنون برای کمک شما",
          },
        ],
      },
      {
        german: "Bitte",
        english: "Please / You're welcome",
        persian: "لطفاً / خواهش می‌کنم",
        level: "A1",
        category: "greetings",
        difficulty: 1,
        pronunciation: "BIT-teh",
        audioUrl: "",
        imageUrl: "",
        tags: ["basic", "polite"],
        examples: [
          {
            german: "Bitte helfen Sie mir",
            english: "Please help me",
            persian: "لطفاً به من کمک کنید",
          },
          {
            german: "Danke - Bitte!",
            english: "Thanks - You're welcome!",
            persian: "متشکرم - خواهش می‌کنم!",
          },
        ],
      },
      {
        german: "Guten Morgen",
        english: "Good morning",
        persian: "صبح بخیر",
        level: "A1",
        category: "greetings",
        difficulty: 1,
        pronunciation: "GOO-ten MOR-gen",
        audioUrl: "",
        imageUrl: "",
        tags: ["basic", "time"],
        examples: [
          {
            german: "Guten Morgen, Frau Schmidt",
            english: "Good morning, Mrs. Schmidt",
            persian: "صبح بخیر، خانم اشمیت",
          },
        ],
      },
      {
        german: "Guten Abend",
        english: "Good evening",
        persian: "عصر بخیر",
        level: "A1",
        category: "greetings",
        difficulty: 1,
        pronunciation: "GOO-ten AH-ben",
        audioUrl: "",
        imageUrl: "",
        tags: ["basic", "time"],
        examples: [
          {
            german: "Guten Abend und gute Nacht",
            english: "Good evening and good night",
            persian: "عصر بخیر و شب بخیر",
          },
        ],
      },
      {
        german: "Auf Wiedersehen",
        english: "Goodbye",
        persian: "خداحافظ",
        level: "A1",
        category: "greetings",
        difficulty: 1,
        pronunciation: "owf VEE-der-zay-en",
        audioUrl: "",
        imageUrl: "",
        tags: ["basic", "farewell"],
        examples: [
          {
            german: "Auf Wiedersehen, bis morgen!",
            english: "Goodbye, until tomorrow!",
            persian: "خداحافظ، تا فردا!",
          },
        ],
      },
      {
        german: "Tschüss",
        english: "Bye",
        persian: "خداحافظ",
        level: "A1",
        category: "greetings",
        difficulty: 1,
        pronunciation: "CHUSS",
        audioUrl: "",
        imageUrl: "",
        tags: ["basic", "informal"],
        examples: [
          {
            german: "Tschüss, bis später!",
            english: "Bye, see you later!",
            persian: "خداحافظ، بعد می‌بینمت!",
          },
        ],
      },
      {
        german: "Entschuldigung",
        english: "Excuse me / Sorry",
        persian: "ببخشید / معذرت می‌خوام",
        level: "A1",
        category: "greetings",
        difficulty: 1,
        pronunciation: "ent-SHOOL-dee-goong",
        audioUrl: "",
        imageUrl: "",
        tags: ["basic", "polite"],
        examples: [
          {
            german: "Entschuldigung, wo ist der Bahnhof?",
            english: "Excuse me, where is the train station?",
            persian: "ببخشید، ایستگاه قطار کجاست؟",
          },
        ],
      },
      {
        german: "Ich",
        english: "I",
        persian: "من",
        level: "A1",
        category: "pronouns",
        difficulty: 1,
        pronunciation: "ikh",
        audioUrl: "",
        imageUrl: "",
        tags: ["basic", "pronoun"],
        examples: [
          {
            german: "Ich heiße Ali",
            english: "My name is Ali",
            persian: "من علی هستم",
          },
          {
            german: "Ich komme aus Deutschland",
            english: "I come from Germany",
            persian: "من از آلمان می‌آیم",
          },
        ],
      },
      {
        german: "Du",
        english: "You (informal)",
        persian: "تو (غیررسمی)",
        level: "A1",
        category: "pronouns",
        difficulty: 1,
        pronunciation: "doo",
        audioUrl: "",
        imageUrl: "",
        tags: ["basic", "pronoun"],
        examples: [
          {
            german: "Wie heißt du?",
            english: "What's your name?",
            persian: "اسم تو چیه؟",
          },
        ],
      },
      {
        german: "Er",
        english: "He",
        persian: "او (مذکر)",
        level: "A1",
        category: "pronouns",
        difficulty: 1,
        pronunciation: "air",
        audioUrl: "",
        imageUrl: "",
        tags: ["basic", "pronoun"],
        examples: [
          {
            german: "Er kommt aus Berlin",
            english: "He comes from Berlin",
            persian: "او از برلین می‌آید",
          },
        ],
      },
      {
        german: "Sie",
        english: "She / You (formal)",
        persian: "او (مونث) / شما (رسمی)",
        level: "A1",
        category: "pronouns",
        difficulty: 1,
        pronunciation: "zee",
        audioUrl: "",
        imageUrl: "",
        tags: ["basic", "pronoun"],
        examples: [
          {
            german: "Sie ist meine Mutter",
            english: "She is my mother",
            persian: "او مادر من است",
          },
        ],
      },
      {
        german: "Wir",
        english: "We",
        persian: "ما",
        level: "A1",
        category: "pronouns",
        difficulty: 1,
        pronunciation: "veer",
        audioUrl: "",
        imageUrl: "",
        tags: ["basic", "pronoun"],
        examples: [
          {
            german: "Wir gehen ins Kino",
            english: "We are going to the cinema",
            persian: "ما به سینما می‌رویم",
          },
        ],
      },
      {
        german: "sein",
        english: "to be",
        persian: "بودن",
        level: "A1",
        category: "verbs",
        difficulty: 2,
        pronunciation: "zine",
        audioUrl: "",
        imageUrl: "",
        tags: ["basic", "verb", "irregular"],
        examples: [
          {
            german: "Ich bin müde",
            english: "I am tired",
            persian: "من خسته هستم",
          },
          {
            german: "Er ist zu Hause",
            english: "He is at home",
            persian: "او در خانه است",
          },
        ],
      },
      {
        german: "haben",
        english: "to have",
        persian: "داشتن",
        level: "A1",
        category: "verbs",
        difficulty: 2,
        pronunciation: "HAH-ben",
        audioUrl: "",
        imageUrl: "",
        tags: ["basic", "verb", "irregular"],
        examples: [
          {
            german: "Ich habe einen Bruder",
            english: "I have a brother",
            persian: "من یک برادر دارم",
          },
          {
            german: "Hast du Zeit?",
            english: "Do you have time?",
            persian: "وقت داری؟",
          },
        ],
      },
      {
        german: "gehen",
        english: "to go",
        persian: "رفتن",
        level: "A1",
        category: "verbs",
        difficulty: 2,
        pronunciation: "GAY-en",
        audioUrl: "",
        imageUrl: "",
        tags: ["basic", "verb"],
        examples: [
          {
            german: "Ich gehe zur Schule",
            english: "I go to school",
            persian: "من به مدرسه می‌روم",
          },
        ],
      },
      {
        german: "kommen",
        english: "to come",
        persian: "آمدن",
        level: "A1",
        category: "verbs",
        difficulty: 2,
        pronunciation: "KOM-men",
        audioUrl: "",
        imageUrl: "",
        tags: ["basic", "verb"],
        examples: [
          {
            german: "Woher kommst du?",
            english: "Where do you come from?",
            persian: "از کجا می‌آیی؟",
          },
        ],
      },
      {
        german: "essen",
        english: "to eat",
        persian: "خوردن",
        level: "A1",
        category: "verbs",
        difficulty: 2,
        pronunciation: "ES-en",
        audioUrl: "",
        imageUrl: "",
        tags: ["basic", "verb"],
        examples: [
          {
            german: "Ich esse einen Apfel",
            english: "I eat an apple",
            persian: "من یک سیب می‌خورم",
          },
        ],
      },
      {
        german: "trinken",
        english: "to drink",
        persian: "نوشیدن",
        level: "A1",
        category: "verbs",
        difficulty: 2,
        pronunciation: "TRINK-en",
        audioUrl: "",
        imageUrl: "",
        tags: ["basic", "verb"],
        examples: [
          {
            german: "Ich trinke Kaffee",
            english: "I drink coffee",
            persian: "من قهوه می‌نوشم",
          },
        ],
      },
      {
        german: "sprechen",
        english: "to speak",
        persian: "صحبت کردن",
        level: "A1",
        category: "verbs",
        difficulty: 2,
        pronunciation: "SHPREKH-en",
        audioUrl: "",
        imageUrl: "",
        tags: ["basic", "verb"],
        examples: [
          {
            german: "Ich spreche Deutsch",
            english: "I speak German",
            persian: "من آلمانی صحبت می‌کنم",
          },
        ],
      },
      {
        german: "lernen",
        english: "to learn",
        persian: "یاد گرفتن",
        level: "A1",
        category: "verbs",
        difficulty: 2,
        pronunciation: "LAIR-nen",
        audioUrl: "",
        imageUrl: "",
        tags: ["basic", "verb"],
        examples: [
          {
            german: "Ich lerne Deutsch",
            english: "I learn German",
            persian: "من آلمانی یاد می‌گیرم",
          },
        ],
      },
      {
        german: "arbeiten",
        english: "to work",
        persian: "کار کردن",
        level: "A1",
        category: "verbs",
        difficulty: 2,
        pronunciation: "AR-bite-en",
        audioUrl: "",
        imageUrl: "",
        tags: ["basic", "verb"],
        examples: [
          {
            german: "Ich arbeite in Berlin",
            english: "I work in Berlin",
            persian: "من در برلین کار می‌کنم",
          },
        ],
      },
      {
        german: "wohnen",
        english: "to live",
        persian: "زندگی کردن",
        level: "A1",
        category: "verbs",
        difficulty: 2,
        pronunciation: "VOH-nen",
        audioUrl: "",
        imageUrl: "",
        tags: ["basic", "verb"],
        examples: [
          {
            german: "Ich wohne in Hamburg",
            english: "I live in Hamburg",
            persian: "من در هامبورگ زندگی می‌کنم",
          },
        ],
      },
      {
        german: "das Haus",
        english: "the house",
        persian: "خانه",
        level: "A1",
        category: "nouns",
        difficulty: 1,
        pronunciation: "dahs HOUSE",
        audioUrl: "",
        imageUrl: "",
        tags: ["basic", "noun", "neuter"],
        examples: [
          {
            german: "Das Haus ist groß",
            english: "The house is big",
            persian: "خانه بزرگ است",
          },
        ],
      },
      {
        german: "der Tisch",
        english: "the table",
        persian: "میز",
        level: "A1",
        category: "nouns",
        difficulty: 1,
        pronunciation: "dair TISH",
        audioUrl: "",
        imageUrl: "",
        tags: ["basic", "noun", "masculine"],
        examples: [
          {
            german: "Der Tisch ist aus Holz",
            english: "The table is made of wood",
            persian: "میز از چوب ساخته شده",
          },
        ],
      },
      {
        german: "die Tür",
        english: "the door",
        persian: "در",
        level: "A1",
        category: "nouns",
        difficulty: 1,
        pronunciation: "dee TOOR",
        audioUrl: "",
        imageUrl: "",
        tags: ["basic", "noun", "feminine"],
        examples: [
          {
            german: "Die Tür ist offen",
            english: "The door is open",
            persian: "در باز است",
          },
        ],
      },
      {
        german: "das Buch",
        english: "the book",
        persian: "کتاب",
        level: "A1",
        category: "nouns",
        difficulty: 1,
        pronunciation: "dahs BOOKH",
        audioUrl: "",
        imageUrl: "",
        tags: ["basic", "noun", "neuter"],
        examples: [
          {
            german: "Ich lese ein Buch",
            english: "I read a book",
            persian: "من یک کتاب می‌خوانم",
          },
        ],
      },
      {
        german: "der Stuhl",
        english: "the chair",
        persian: "صندلی",
        level: "A1",
        category: "nouns",
        difficulty: 1,
        pronunciation: "dair SHTOOL",
        audioUrl: "",
        imageUrl: "",
        tags: ["basic", "noun", "masculine"],
        examples: [
          {
            german: "Der Stuhl ist bequem",
            english: "The chair is comfortable",
            persian: "صندلی راحت است",
          },
        ],
      },
      {
        german: "das Auto",
        english: "the car",
        persian: "ماشین",
        level: "A1",
        category: "nouns",
        difficulty: 1,
        pronunciation: "dahs OW-toh",
        audioUrl: "",
        imageUrl: "",
        tags: ["basic", "noun", "neuter"],
        examples: [
          {
            german: "Das Auto ist neu",
            english: "The car is new",
            persian: "ماشین جدید است",
          },
        ],
      },
      {
        german: "die Schule",
        english: "the school",
        persian: "مدرسه",
        level: "A1",
        category: "nouns",
        difficulty: 1,
        pronunciation: "dee SHOO-leh",
        audioUrl: "",
        imageUrl: "",
        tags: ["basic", "noun", "feminine"],
        examples: [
          {
            german: "Ich gehe zur Schule",
            english: "I go to school",
            persian: "من به مدرسه می‌روم",
          },
        ],
      },
      {
        german: "der Apfel",
        english: "the apple",
        persian: "سیب",
        level: "A1",
        category: "nouns",
        difficulty: 1,
        pronunciation: "dair AP-fel",
        audioUrl: "",
        imageUrl: "",
        tags: ["basic", "noun", "masculine"],
        examples: [
          {
            german: "Der Apfel ist rot",
            english: "The apple is red",
            persian: "سیب قرمز است",
          },
        ],
      },
      {
        german: "das Wasser",
        english: "the water",
        persian: "آب",
        level: "A1",
        category: "nouns",
        difficulty: 1,
        pronunciation: "dahs VAH-ser",
        audioUrl: "",
        imageUrl: "",
        tags: ["basic", "noun", "neuter"],
        examples: [
          {
            german: "Das Wasser ist kalt",
            english: "The water is cold",
            persian: "آب سرد است",
          },
        ],
      },
      {
        german: "der Kaffee",
        english: "the coffee",
        persian: "قهوه",
        level: "A1",
        category: "nouns",
        difficulty: 1,
        pronunciation: "dair kah-FAY",
        audioUrl: "",
        imageUrl: "",
        tags: ["basic", "noun", "masculine"],
        examples: [
          {
            german: "Ich trinke gern Kaffee",
            english: "I like to drink coffee",
            persian: "من دوست دارم قهوه بنوشم",
          },
        ],
      },
      {
        german: "die Zeit",
        english: "the time",
        persian: "زمان",
        level: "A1",
        category: "nouns",
        difficulty: 1,
        pronunciation: "dee TSITE",
        audioUrl: "",
        imageUrl: "",
        tags: ["basic", "noun", "feminine"],
        examples: [
          {
            german: "Wie spät ist die Zeit?",
            english: "What time is it?",
            persian: "ساعت چند است؟",
          },
        ],
      },
      {
        german: "gut",
        english: "good",
        persian: "خوب",
        level: "A1",
        category: "adjectives",
        difficulty: 1,
        pronunciation: "goot",
        audioUrl: "",
        imageUrl: "",
        tags: ["basic", "adjective"],
        examples: [
          {
            german: "Das Essen ist gut",
            english: "The food is good",
            persian: "غذا خوب است",
          },
        ],
      },
      {
        german: "schlecht",
        english: "bad",
        persian: "بد",
        level: "A1",
        category: "adjectives",
        difficulty: 1,
        pronunciation: "SHLEKH-t",
        audioUrl: "",
        imageUrl: "",
        tags: ["basic", "adjective"],
        examples: [
          {
            german: "Das Wetter ist schlecht",
            english: "The weather is bad",
            persian: "هوا بد است",
          },
        ],
      },
      {
        german: "groß",
        english: "big",
        persian: "بزرگ",
        level: "A1",
        category: "adjectives",
        difficulty: 1,
        pronunciation: "grohs",
        audioUrl: "",
        imageUrl: "",
        tags: ["basic", "adjective"],
        examples: [
          {
            german: "Das Haus ist groß",
            english: "The house is big",
            persian: "خانه بزرگ است",
          },
        ],
      },
      {
        german: "klein",
        english: "small",
        persian: "کوچک",
        level: "A1",
        category: "adjectives",
        difficulty: 1,
        pronunciation: "khline",
        audioUrl: "",
        imageUrl: "",
        tags: ["basic", "adjective"],
        examples: [
          {
            german: "Die Katze ist klein",
            english: "The cat is small",
            persian: "گربه کوچک است",
          },
        ],
      },
      {
        german: "neu",
        english: "new",
        persian: "جدید",
        level: "A1",
        category: "adjectives",
        difficulty: 1,
        pronunciation: "noy",
        audioUrl: "",
        imageUrl: "",
        tags: ["basic", "adjective"],
        examples: [
          {
            german: "Ich habe ein neues Auto",
            english: "I have a new car",
            persian: "من یک ماشین جدید دارم",
          },
        ],
      },
      {
        german: "alt",
        english: "old",
        persian: "قدیمی",
        level: "A1",
        category: "adjectives",
        difficulty: 1,
        pronunciation: "ahlt",
        audioUrl: "",
        imageUrl: "",
        tags: ["basic", "adjective"],
        examples: [
          {
            german: "Mein Vater ist alt",
            english: "My father is old",
            persian: "پدر من پیر است",
          },
        ],
      },
      {
        german: "schön",
        english: "beautiful",
        persian: "زیبا",
        level: "A1",
        category: "adjectives",
        difficulty: 1,
        pronunciation: "shurn",
        audioUrl: "",
        imageUrl: "",
        tags: ["basic", "adjective"],
        examples: [
          {
            german: "Die Blumen sind schön",
            english: "The flowers are beautiful",
            persian: "گل‌ها زیبا هستند",
          },
        ],
      },
      {
        german: "müde",
        english: "tired",
        persian: "خسته",
        level: "A1",
        category: "adjectives",
        difficulty: 1,
        pronunciation: "MOO-deh",
        audioUrl: "",
        imageUrl: "",
        tags: ["basic", "adjective"],
        examples: [
          {
            german: "Ich bin müde",
            english: "I am tired",
            persian: "من خسته هستم",
          },
        ],
      },
      {
        german: "glücklich",
        english: "happy",
        persian: "خوشحال",
        level: "A1",
        category: "adjectives",
        difficulty: 1,
        pronunciation: "GLUK-likh",
        audioUrl: "",
        imageUrl: "",
        tags: ["basic", "adjective"],
        examples: [
          {
            german: "Ich bin sehr glücklich",
            english: "I am very happy",
            persian: "من خیلی خوشحالم",
          },
        ],
      },
      {
        german: "eins",
        english: "one",
        persian: "یک",
        level: "A1",
        category: "numbers",
        difficulty: 1,
        pronunciation: "ines",
        audioUrl: "",
        imageUrl: "",
        tags: ["basic", "number"],
        examples: [
          {
            german: "Ich habe ein Buch",
            english: "I have one book",
            persian: "من یک کتاب دارم",
          },
        ],
      },
      {
        german: "zwei",
        english: "two",
        persian: "دو",
        level: "A1",
        category: "numbers",
        difficulty: 1,
        pronunciation: "tsvigh",
        audioUrl: "",
        imageUrl: "",
        tags: ["basic", "number"],
        examples: [
          {
            german: "Ich habe zwei Katzen",
            english: "I have two cats",
            persian: "من دو گربه دارم",
          },
        ],
      },
      {
        german: "drei",
        english: "three",
        persian: "سه",
        level: "A1",
        category: "numbers",
        difficulty: 1,
        pronunciation: "dry",
        audioUrl: "",
        imageUrl: "",
        tags: ["basic", "number"],
        examples: [
          {
            german: "Drei Kaffee, bitte",
            english: "Three coffees, please",
            persian: "سه قهوه، لطفاً",
          },
        ],
      },
      {
        german: "vier",
        english: "four",
        persian: "چهار",
        level: "A1",
        category: "numbers",
        difficulty: 1,
        pronunciation: "feer",
        audioUrl: "",
        imageUrl: "",
        tags: ["basic", "number"],
        examples: [
          {
            german: "Wir sind vier Personen",
            english: "We are four people",
            persian: "ما چهار نفر هستیم",
          },
        ],
      },
      {
        german: "fünf",
        english: "five",
        persian: "پنج",
        level: "A1",
        category: "numbers",
        difficulty: 1,
        pronunciation: "fuenf",
        audioUrl: "",
        imageUrl: "",
        tags: ["basic", "number"],
        examples: [
          {
            german: "Ich habe fünf Bücher",
            english: "I have five books",
            persian: "من پنج کتاب دارم",
          },
        ],
      },
    ];

    // Seed Flashcards - create flashcards for all words with proper linking
    const flashcards = words.map((word) => ({
      front: word.german,
      back: word.english,
      type: word.category === "verbs" ? "grammar" : "word",
      difficulty: word.difficulty,
      interval: 1,
      repetitions: 0,
      easeFactor: 2.5,
      nextReview: new Date(),
      wordId: null, // Will be populated after words are created
      userId: "current-user",
    }));

    // Insert words first to get their IDs
    const insertedWords = await Word.insertMany(words);
    console.log("Words seeded successfully");

    // Now update flashcards with proper wordId linking
    const flashcardsWithWordId = flashcards.map((flashcard, index) => ({
      ...flashcard,
      wordId: insertedWords[index % insertedWords.length]._id, // Link to corresponding word
    }));

    await Flashcard.insertMany(flashcardsWithWordId);
    console.log("Flashcards seeded successfully");
    const exercises = [
      {
        title: "Basic Greetings",
        description: "Practice common German greetings",
        exerciseType: "multiple_choice",
        level: "A1",
        topicCategory: "daily",
        difficultyScore: 1,
        timeLimitMinutes: 5,
        questions: [
          {
            question: "How do you say 'Hello' in German?",
            questionData: null,
            options: ["Hallo", "Tschüss", "Auf Wiedersehen", "Guten Morgen"],
            correctAnswer: 0,
            explanation: "Hallo is the standard greeting for 'Hello' in German",
            points: 1,
            orderIndex: 0,
          },
          {
            question: "What does 'Danke' mean?",
            questionData: null,
            options: ["Please", "Thank you", "Sorry", "Goodbye"],
            correctAnswer: 1,
            explanation: "Danke means 'Thank you' in German",
            points: 1,
            orderIndex: 1,
          },
        ],
        instructions: "Choose the correct answer for each question",
        passingScore: 80,
        maxAttempts: 3,
        tags: ["greetings", "basic"],
        isActive: true,
      },
      {
        title: "Present Tense of 'sein'",
        description: "Practice conjugating the verb 'to be' in present tense",
        exerciseType: "fill_blank",
        level: "A1",
        topicCategory: "grammar",
        difficultyScore: 2,
        timeLimitMinutes: 10,
        questions: [
          {
            question: "Ich ___ müde (I am tired)",
            questionData: { blankPosition: 1 },
            options: ["bin", "bist", "ist", "sind"],
            correctAnswer: 0,
            explanation: "The correct form for 'ich' is 'bin'",
            points: 2,
            orderIndex: 0,
          },
          {
            question: "Du ___ Student (You are a student)",
            questionData: { blankPosition: 1 },
            options: ["bin", "bist", "ist", "sind"],
            correctAnswer: 1,
            explanation: "The correct form for 'du' is 'bist'",
            points: 2,
            orderIndex: 1,
          },
        ],
        instructions: "Fill in the blank with the correct form of 'sein'",
        passingScore: 70,
        maxAttempts: 3,
        tags: ["grammar", "verbs", "sein"],
        isActive: true,
      },
    ];

    await Exercise.insertMany(exercises);
    console.log("Exercises seeded successfully");

    // Seed Exams
    const exams = [
      {
        title: "German Basics Assessment",
        description:
          "Test your knowledge of basic German greetings and phrases",
        level: "A1",
        topicCategory: "assessment",
        durationMinutes: 15,
        questions: [
          {
            question: "What is the proper response to 'Wie geht es dir?'",
            questionData: null,
            options: [
              "Mir geht es gut",
              "Ich heiße...",
              "Auf Wiedersehen",
              "Tschüss",
            ],
            correctAnswer: 0,
            explanation:
              "'Mir geht es gut' means 'I'm doing well' and is the proper response",
            points: 5,
            orderIndex: 0,
          },
          {
            question: "Translate: 'Thank you very much'",
            questionData: null,
            options: ["Danke", "Bitte", "Vielen Dank", "Guten Tag"],
            correctAnswer: 2,
            explanation: "'Vielen Dank' means 'Thank you very much'",
            points: 5,
            orderIndex: 1,
          },
          {
            question: "Complete: Ich ___ Student (I am a student)",
            questionData: { blankPosition: 1 },
            options: ["bin", "bist", "ist", "sind"],
            correctAnswer: 0,
            explanation: "For 'ich', the correct form of 'sein' is 'bin'",
            points: 5,
            orderIndex: 2,
          },
        ],
        instructions: "Answer all questions to the best of your ability",
        passingScore: 70,
        maxAttempts: 3,
        tags: ["assessment", "basics", "A1"],
        isActive: true,
      },
    ];

    await Exam.insertMany(exams);
    console.log("Exams seeded successfully");

    // Seed User Progress
    const userProgress = {
      userId: "current-user",
      currentLevel: "A1",
      totalWords: 5,
      masteredWords: 2,
      accuracy: 0.75,
      streakDays: 3,
      totalReviews: 15,
      grammarProgress: {
        present: 0.6,
        past: 0.2,
        future: 0.1,
      },
      vocabularyProgress: {
        greetings: 0.8,
        pronouns: 0.6,
        verbs: 0.4,
      },
      lastActiveDate: new Date(),
      totalExams: 0,
      examAttempts: 0,
      lastExamScore: null,
      lastExamDate: null,
    };

    await UserProgress.create(userProgress);
    console.log("User progress seeded successfully");

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};

module.exports = seedDatabase;
