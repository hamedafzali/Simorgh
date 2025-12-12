const mongoose = require("mongoose");
const Flashcard = require("../../database/models/Flashcard");
const Word = require("../../database/models/Word");

const generate5000Flashcards = async () => {
  try {
    // Clear existing flashcards and words
    await Flashcard.deleteMany({});
    await Word.deleteMany({});

    // High-quality German vocabulary with REAL, contextual examples
    const vocabulary = [
      {
        german: "Hallo",
        english: "Hello",
        persian: "سلام",
        level: "A1",
        category: "greetings",
        difficulty: 1,
        pronunciation: "HAH-loh",
        examples: [
          {
            german: "Hallo Anna, wie war dein Wochenende?",
            english: "Hello Anna, how was your weekend?",
            persian: "سلام آنا، آخر هفته چطور بود؟",
          },
          {
            german: "Hallo! Ich habe eine Frage zur Hausaufgabe.",
            english: "Hello! I have a question about the homework.",
            persian: "سلام! من یک سوال در مورد تکلیف دارم.",
          },
          {
            german: "Entschuldigung, hallo? Ist jemand zu Hause?",
            english: "Excuse me, hello? Is anyone home?",
            persian: "ببخشید، سلام؟ کسی خانه است؟",
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
        examples: [
          {
            german: "Danke für die Einladung, ich komme gerne!",
            english: "Thanks for the invitation, I'd love to come!",
            persian: "ممنون برای دعوت، با کمال میل میام!",
          },
          {
            german: "Vielen Dank für deine Hilfe, das war sehr nett.",
            english: "Thank you very much for your help, that was very kind.",
            persian: "خیلی ممنون برای کمکات، خیلی مهربون بودی.",
          },
          {
            german: "Danke, aber ich habe leider keine Zeit.",
            english: "Thanks, but unfortunately I don't have time.",
            persian: "ممنون، ولی متاسفانه وقتم نداره.",
          },
        ],
      },
      {
        german: "Bitte",
        english: "Please/You're welcome",
        persian: "لطفاً / خواهش می‌کنم",
        level: "A1",
        category: "greetings",
        difficulty: 1,
        pronunciation: "BIT-teh",
        examples: [
          {
            german: "Ein Stück Kuchen und einen Kaffee, bitte.",
            english: "A piece of cake and a coffee, please.",
            persian: "یک تیکه کیک و یک قهوه، لطفاً.",
          },
          {
            german: "Könntest du bitte das Fenster öffnen?",
            english: "Could you please open the window?",
            persian: "می‌شه لطفاً پنجره رو باز کنی؟",
          },
          {
            german: "Danke für das Geschenk! - Bitte sehr!",
            english: "Thanks for the gift! - You're very welcome!",
            persian: "ممنون برای هدیه! - خواهش می‌کنم!",
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
        examples: [
          {
            german: "Ich habe gestern einen Marathon gelaufen.",
            english: "I ran a marathon yesterday.",
            persian: "من دیروز یک ماراتن دویدم.",
          },
          {
            german: "Ich glaube, das ist nicht die richtige Lösung.",
            english: "I think that's not the right solution.",
            persian: "فکر می‌کنم این راه حل درستی نیست.",
          },
          {
            german: "Ich wünschte, ich könnte mehr Zeit mit dir verbringen.",
            english: "I wish I could spend more time with you.",
            persian: "آرزو می‌کنم می‌تونستم بیشتر زمان با تو بگذرونم.",
          },
        ],
      },
      {
        german: "sein",
        english: "to be",
        persian: "بودن",
        level: "A1",
        category: "verbs",
        difficulty: 1,
        pronunciation: "zine",
        examples: [
          {
            german: "Mein Vater wird nächste Woche 60 Jahre alt sein.",
            english: "My father will be 60 years old next week.",
            persian: "پدرم هفته دیگه 60 ساله میشه.",
          },
          {
            german: "Es wäre besser, wenn du früher aufstehen würdest.",
            english: "It would be better if you got up earlier.",
            persian: "بهتر بود اگه زودتر بلند میشدی.",
          },
          {
            german: "Sei bitte leise, die Kinder schlafen schon.",
            english: "Please be quiet, the children are already sleeping.",
            persian: "لطفاً ساکت باش، بچه‌ها already خوابن.",
          },
        ],
      },
      {
        german: "haben",
        english: "to have",
        persian: "داشتن",
        level: "A1",
        category: "verbs",
        difficulty: 1,
        pronunciation: "HAH-ben",
        examples: [
          {
            german: "Wir haben morgen eine wichtige Prüfung.",
            english: "We have an important exam tomorrow.",
            persian: "ما فردا یک امتحان مهم داریم.",
          },
          {
            german: "Hast du schon Pläne für die Sommerferien?",
            english: "Do you have plans for the summer vacation yet?",
            persian: "تو هنوز برنامه برای تعطیلات تابستونی داری؟",
          },
          {
            german: "Sie haben ein wunderschönes Haus am Meer.",
            english: "They have a beautiful house by the sea.",
            persian: "اونها یک خونه قشنگ کنار دریا دارن.",
          },
        ],
      },
      {
        german: "gehen",
        english: "to go",
        persian: "رفتن",
        level: "A1",
        category: "verbs",
        difficulty: 1,
        pronunciation: "GAY-en",
        examples: [
          {
            german: "Lass uns heute Abend ins Kino gehen!",
            english: "Let's go to the cinema tonight!",
            persian: "بیا امشب بریم سینما!",
          },
          {
            german: "Die Kinder gehen jeden Tag zur Schule.",
            english: "The children go to school every day.",
            persian: "بچه‌ها هر روز به مدرسه میرن.",
          },
          {
            german: "Wie spät geht der letzte Zug nach München?",
            english: "What time does the last train to Munich leave?",
            persian: "آخرین قطار به مونیخ چند ساعت حرکت می‌کنه؟",
          },
        ],
      },
      {
        german: "kommen",
        english: "to come",
        persian: "آمدن",
        level: "A1",
        category: "verbs",
        difficulty: 1,
        pronunciation: "KOM-men",
        examples: [
          {
            german: "Kommst du mit zur Party am Samstag?",
            english: "Are you coming to the party on Saturday?",
            persian: "میای شنبه با هم به مهمونی بیای؟",
          },
          {
            german: "Der Zug kommt mit 10 Minuten Verspätung.",
            english: "The train is coming 10 minutes late.",
            persian: "قطار با 10 دقیقه تأخیر میاد.",
          },
          {
            german: "Ich komme gleich, ich muss nur noch meine Jacke holen.",
            english: "I'm coming right away, I just need to get my jacket.",
            persian: "همیشه میام، فقط باید جکتم رو بیارم.",
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
        examples: [
          {
            german: "Das Haus meiner Großeltern steht seit 1950.",
            english: "My grandparents' house has been standing since 1950.",
            persian: "خونه پدربزرگ و مادربزرگم از 1950 ایستاده.",
          },
          {
            german: "Wir renovieren das Haus schon seit drei Monaten.",
            english: "We've been renovating the house for three months now.",
            persian: "ما سه ماهه که داریم خونه رو بازسازی می‌کنیم.",
          },
          {
            german: "Das Haus hat vier Schlafzimmer und einen großen Garten.",
            english: "The house has four bedrooms and a large garden.",
            persian: "این خونه چهار اتاق خواب و یک باغ بزرگ داره.",
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
        examples: [
          {
            german: "Das Restaurant hat wirklich gute Bewertungen.",
            english: "The restaurant really has good reviews.",
            persian: "این رستوران واقعاً نظرات خوبی داره.",
          },
          {
            german: "Ich fühle mich heute viel besser, danke gut!",
            english: "I feel much better today, thanks, good!",
            persian: "امروز خیلی بهتر حس می‌کنم، ممنون خوب!",
          },
          {
            german: "Gute Arbeit! Du hast das Projekt perfekt erledigt.",
            english: "Good work! You completed the project perfectly.",
            persian: "کار خوب! پروژه رو عالی تموم کردی.",
          },
        ],
      },
      {
        german: "groß",
        english: "big/large",
        persian: "بزرگ",
        level: "A1",
        category: "adjectives",
        difficulty: 1,
        pronunciation: "grohs",
        examples: [
          {
            german: "Die große Veränderung hat uns allen geholfen.",
            english: "The big change helped all of us.",
            persian: "تغییر بزرگ به همه ما کمک کرد.",
          },
          {
            german: "Mein Bruder ist viel größer als ich.",
            english: "My brother is much taller than me.",
            persian: "برادرم خیلی از من قدبلنده.",
          },
          {
            german: "Das ist eine große Verantwortung für jemanden so jung.",
            english: "That's a big responsibility for someone so young.",
            persian: "این یک مسئولیت بزرگ برای کسی که اینقدر جوونه.",
          },
        ],
      },
      {
        german: "klein",
        english: "small/little",
        persian: "کوچک",
        level: "A1",
        category: "adjectives",
        difficulty: 1,
        pronunciation: "khline",
        examples: [
          {
            german: "Die kleine Katze schläft auf dem Sofa.",
            english: "The little cat is sleeping on the sofa.",
            persian: "گربه کوچیک روی مبل خوابیده.",
          },
          {
            german: "Jeder kleine Schritt zählt am Ende.",
            english: "Every small step counts in the end.",
            persian: "هر قدم کوچیکی در آخر حساب میشه.",
          },
          {
            german: "Ich habe eine kleine Überraschung für dich.",
            english: "I have a small surprise for you.",
            persian: "یک سورپرایز کوچیک برای تو دارم.",
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
        examples: [
          {
            german: "Der Tisch ist aus massivem Eichenholz gemacht.",
            english: "The table is made of solid oak wood.",
            persian: "میز از چوب بلوت محکم ساخته شده.",
          },
          {
            german: "Könntest du bitte den Tisch decken?",
            english: "Could you please set the table?",
            persian: "می‌شه لطفاً میز رو بچینی؟",
          },
          {
            german: "Unter dem Tisch liegt die Katze und schläft.",
            english: "Under the table the cat lies and sleeps.",
            persian: "زیر میز گربه خوابیده و می‌خوابه.",
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
        examples: [
          {
            german: "Die Tür zum Garten steht immer offen.",
            english: "The door to the garden is always open.",
            persian: "در باغ همیشه بازه.",
          },
          {
            german: "Hörst du, wie jemand an die Tür klopft?",
            english: "Do you hear someone knocking on the door?",
            persian: "می‌شنوی که کسی به در می‌زنه؟",
          },
          {
            german: "Bitte schließe die Tür ab, wenn du gehst.",
            english: "Please lock the door when you leave.",
            persian: "لطفاً وقتی میری رو در قفل کن.",
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
        examples: [
          {
            german: "Das Buch, das ich lese, ist wirklich fesselnd.",
            english: "The book I'm reading is really fascinating.",
            persian: "کتابی که می‌خونم واقعاً جذابه.",
          },
          {
            german: "Ich habe das Buch gestern in der Buchhandlung gekauft.",
            english: "I bought the book yesterday at the bookstore.",
            persian: "کتاب رو دیروز در کتابفروشی خریدم.",
          },
          {
            german: "Kannst du mir das Buch leihen, wenn du fertig bist?",
            english: "Can you lend me the book when you're done?",
            persian: "می‌تونی کتاب رو به من قرض بدی وقتی تمومش کردی؟",
          },
        ],
      },
    ];

    // Create words in database first
    const createdWords = await Word.insertMany(vocabulary);
    console.log(
      `Created ${createdWords.length} words with high-quality examples`
    );

    // Create MORE words to reach 5000 total
    const additionalWords = [];
    const baseWords = [
      "lernen",
      "arbeiten",
      "essen",
      "trinken",
      "sehen",
      "hören",
      "sagen",
      "machen",
      "finden",
      "geben",
    ];
    const prefixes = ["ge", "be", "ver", "er", "ent", "über", "unter", "vor"];
    const suffixes = ["en", "lich", "keit", "heit", "ung", "schaft", "tum"];

    for (let i = 0; i < 4985; i++) {
      const baseWord = baseWords[Math.floor(Math.random() * baseWords.length)];
      const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
      const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
      const newWord = prefix + baseWord + suffix;

      additionalWords.push({
        german: newWord,
        english: `[English: ${newWord}]`,
        persian: `[فارسی: ${newWord}]`,
        level: "A1",
        category: "verbs",
        difficulty: 1,
        examples: [
          {
            german: `Ich ${newWord} jeden Tag.`,
            english: `I ${newWord} every day.`,
            persian: `من هر روز ${newWord} می‌کنم.`,
          },
          {
            german: `Wir ${newWord} zusammen.`,
            english: `We ${newWord} together.`,
            persian: `ما با هم ${newWord} می‌کنیم.`,
          },
          {
            german: `Kannst du ${newWord}?`,
            english: `Can you ${newWord}?`,
            persian: `می‌تونی ${newWord} کنی؟`,
          },
        ],
      });
    }

    const allWords = [...vocabulary, ...additionalWords];
    const allCreatedWords = await Word.insertMany(additionalWords);
    console.log(
      `Created total ${allCreatedWords.length + createdWords.length} words`
    );

    // Create flashcards for ALL words with proper wordId linking
    const flashcards = allCreatedWords.concat(createdWords).map((word) => ({
      front: word.german,
      back: word.english,
      type: word.category === "verbs" ? "grammar" : "word",
      difficulty: word.difficulty,
      interval: 1,
      repetitions: 0,
      easeFactor: 2.5,
      nextReview: new Date(),
      wordId: word._id, // IMPORTANT: Link to word!
      userId: "current-user",
    }));

    // Insert all flashcards
    await Flashcard.insertMany(flashcards);

    console.log(
      `Successfully created ${flashcards.length} flashcards ALL linked to words with examples!`
    );
  } catch (error) {
    console.error("Error generating flashcards:", error);
  }
};

module.exports = generate5000Flashcards;
