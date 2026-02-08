const mongoose = require("mongoose");
const Exam = require("../../database/models/Exam");

const generate5000Exams = async () => {
  try {
    console.log("Generating 5000 German exams...");

    // Clear existing exams
    await Exam.deleteMany({});

    const examTemplates = [
      {
        title: "German Vocabulary Test",
        description: "Test your German vocabulary knowledge",
        level: "A1",
        topicCategory: "vocabulary",
        durationMinutes: 20,
        passingScore: 70,
        maxAttempts: 3,
        tags: ["vocabulary", "A1"],
      },
      {
        title: "German Grammar Test",
        description: "Test your German grammar skills",
        level: "A1",
        topicCategory: "grammar",
        durationMinutes: 25,
        passingScore: 75,
        maxAttempts: 3,
        tags: ["grammar", "A1"],
      },
      {
        title: "German Conversation Test",
        description: "Test your German conversation skills",
        level: "A2",
        topicCategory: "conversation",
        durationMinutes: 30,
        passingScore: 70,
        maxAttempts: 3,
        tags: ["conversation", "A2"],
      },
      {
        title: "German Reading Comprehension",
        description: "Test your German reading comprehension",
        level: "A2",
        topicCategory: "reading",
        durationMinutes: 35,
        passingScore: 70,
        maxAttempts: 3,
        tags: ["reading", "A2"],
      },
      {
        title: "German Listening Test",
        description: "Test your German listening skills",
        level: "B1",
        topicCategory: "listening",
        durationMinutes: 30,
        passingScore: 70,
        maxAttempts: 3,
        tags: ["listening", "B1"],
      },
    ];

    // Question banks for different types
    const vocabularyQuestions = [
      {
        question: "What does 'Haus' mean?",
        options: ["House", "Home", "Building", "Room"],
        correctAnswer: 0,
        explanation: "'Haus' means 'House' in German",
      },
      {
        question: "What does 'Auto' mean?",
        options: ["Car", "Bike", "Bus", "Train"],
        correctAnswer: 0,
        explanation: "'Auto' means 'Car' in German",
      },
      {
        question: "What does 'Wasser' mean?",
        options: ["Water", "Fire", "Earth", "Air"],
        correctAnswer: 0,
        explanation: "'Wasser' means 'Water' in German",
      },
      {
        question: "What does 'Buch' mean?",
        options: ["Book", "Paper", "Pen", "Table"],
        correctAnswer: 0,
        explanation: "'Buch' means 'Book' in German",
      },
      {
        question: "What does 'Schule' mean?",
        options: ["School", "Hospital", "Shop", "Park"],
        correctAnswer: 0,
        explanation: "'Schule' means 'School' in German",
      },
    ];

    const grammarQuestions = [
      {
        question: "Complete: Ich ___ müde (I ___ tired)",
        options: ["bin", "bist", "ist", "sind"],
        correctAnswer: 0,
        explanation: "For 'ich' (I), the correct form of 'sein' is 'bin'",
      },
      {
        question: "Complete: Du ___ Student (You ___ a student)",
        options: ["bist", "bin", "ist", "sind"],
        correctAnswer: 0,
        explanation: "For 'du' (you), the correct form of 'sein' is 'bist'",
      },
      {
        question: "Complete: Er ___ Lehrer (He ___ a teacher)",
        options: ["ist", "bin", "bist", "sind"],
        correctAnswer: 0,
        explanation: "For 'er' (he), the correct form of 'sein' is 'ist'",
      },
      {
        question: "Complete: Wir ___ hier (We ___ here)",
        options: ["sind", "bin", "bist", "ist"],
        correctAnswer: 0,
        explanation: "For 'wir' (we), the correct form of 'sein' is 'sind'",
      },
      {
        question: "Complete: Ich ___ Kaffee (I ___ coffee)",
        options: ["trinke", "trinkst", "trinkt", "trinken"],
        correctAnswer: 0,
        explanation: "For 'ich' (I), the correct form of 'trinken' is 'trinke'",
      },
    ];

    const conversationQuestions = [
      {
        question: "How do you greet someone formally?",
        options: ["Guten Tag", "Hallo", "Hi", "Servus"],
        correctAnswer: 0,
        explanation: "'Guten Tag' is the formal way to greet someone in German",
      },
      {
        question: "How do you say 'Goodbye' informally?",
        options: ["Tschüss", "Auf Wiedersehen", "Ciao", "Bis bald"],
        correctAnswer: 0,
        explanation: "'Tschüss' is the informal way to say goodbye in German",
      },
      {
        question: "How do you say 'Thank you'?",
        options: ["Danke", "Bitte", "Entschuldigung", "Gern geschehen"],
        correctAnswer: 0,
        explanation: "'Danke' means 'Thank you' in German",
      },
      {
        question: "How do you say 'You're welcome'?",
        options: ["Bitte", "Danke", "Gern", "Nichts zu danken"],
        correctAnswer: 0,
        explanation: "'Bitte' means 'You're welcome' in German",
      },
      {
        question: "How do you say 'Excuse me'?",
        options: ["Entschuldigung", "Danke", "Bitte", "Verzeihung"],
        correctAnswer: 0,
        explanation: "'Entschuldigung' means 'Excuse me' in German",
      },
    ];

    const readingQuestions = [
      {
        question: "In the text 'Anna geht zur Schule', what does Anna do?",
        options: [
          "Goes to school",
          "Works at school",
          "Lives at school",
          "Studies at school",
        ],
        correctAnswer: 0,
        explanation: "'geht zur Schule' means 'goes to school'",
      },
      {
        question: "In 'Ich lese ein Buch', what am I doing?",
        options: [
          "Reading a book",
          "Writing a book",
          "Buying a book",
          "Selling a book",
        ],
        correctAnswer: 0,
        explanation: "'lese ein Buch' means 'reading a book'",
      },
      {
        question: "In 'Der Hund bellt', what is happening?",
        options: [
          "The dog is barking",
          "The dog is sleeping",
          "The dog is eating",
          "The dog is playing",
        ],
        correctAnswer: 0,
        explanation: "'bellt' means 'is barking' in German",
      },
    ];

    const listeningQuestions = [
      {
        question: "When you hear 'Wie spät ist es?', what is being asked?",
        options: [
          "What time is it?",
          "How are you?",
          "Where are you?",
          "What's the weather?",
        ],
        correctAnswer: 0,
        explanation: "'Wie spät ist es?' means 'What time is it?'",
      },
      {
        question: "When you hear 'Wo ist der Bahnhof?', what is being asked?",
        options: [
          "Where is the train station?",
          "What time is the train?",
          "Which train is this?",
          "How far is the station?",
        ],
        correctAnswer: 0,
        explanation:
          "'Wo ist der Bahnhof?' means 'Where is the train station?'",
      },
    ];

    // Helper function to generate exactly 15 questions for each exam
    function generateQuestionsForExam(
      questionBank,
      examNumber,
      questionData = null
    ) {
      const targetQuestionCount = 15;
      let questions = [];

      // If we have enough questions, shuffle and take 15
      if (questionBank.length >= targetQuestionCount) {
        const shuffled = [...questionBank].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, targetQuestionCount);

        questions = selected.map((q, index) => ({
          ...q,
          question: `${q.question} (Exam ${examNumber})`,
          questionData: questionData,
          points: 5,
          orderIndex: index,
        }));
      } else {
        // If we don't have enough questions, duplicate and shuffle
        const neededRounds = Math.ceil(
          targetQuestionCount / questionBank.length
        );
        let expandedBank = [];

        for (let round = 0; round < neededRounds; round++) {
          expandedBank = expandedBank.concat(
            questionBank.map((q) => ({
              ...q,
              question: `${q.question} (Exam ${examNumber}, Part ${round + 1})`,
            }))
          );
        }

        const shuffled = expandedBank.sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, targetQuestionCount);

        questions = selected.map((q, index) => ({
          ...q,
          questionData: questionData,
          points: 5,
          orderIndex: index,
        }));
      }

      return questions;
    }

    // Generate 5000 exams
    const exams = [];

    for (let i = 0; i < 5000; i++) {
      const template = examTemplates[i % examTemplates.length];
      let questions = [];

      // Select question bank based on category and ensure exactly 15 questions
      if (template.topicCategory === "vocabulary") {
        questions = generateQuestionsForExam(vocabularyQuestions, i + 1);
      } else if (template.topicCategory === "grammar") {
        questions = generateQuestionsForExam(grammarQuestions, i + 1, {
          blankPosition: 1,
        });
      } else if (template.topicCategory === "conversation") {
        questions = generateQuestionsForExam(conversationQuestions, i + 1);
      } else if (template.topicCategory === "reading") {
        questions = generateQuestionsForExam(readingQuestions, i + 1);
      } else if (template.topicCategory === "listening") {
        questions = generateQuestionsForExam(listeningQuestions, i + 1);
      }

      exams.push({
        title: `${template.title} #${Math.floor(i / 5) + 1}`,
        description: `${template.description} - Test ${Math.floor(i / 5) + 1}`,
        level: template.level,
        topicCategory: template.topicCategory,
        durationMinutes: template.durationMinutes,
        questions: questions,
        instructions: `Complete all ${questions.length} questions to the best of your ability. You have ${template.durationMinutes} minutes.`,
        passingScore: template.passingScore,
        maxAttempts: template.maxAttempts,
        tags: [...template.tags, `exam-${i + 1}`],
        isActive: true,
      });
    }

    // Insert exams in batches
    const batchSize = 100;
    for (let i = 0; i < exams.length; i += batchSize) {
      const batch = exams.slice(i, i + batchSize);
      await Exam.insertMany(batch);
      console.log(
        `Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(
          exams.length / batchSize
        )} (${batch.length} exams)`
      );
    }

    console.log(`Successfully generated ${exams.length} German exams!`);
    return exams.length;
  } catch (error) {
    console.error("Error generating 5000 exams:", error);
    return 0;
  }
};

module.exports = generate5000Exams;
