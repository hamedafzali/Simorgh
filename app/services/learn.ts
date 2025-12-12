import AsyncStorage from "@react-native-async-storage/async-storage";
import { learningService, type Exam, type Flashcard, type Word } from "./learningService";
import { learnProgressService } from "./learnProgress";
import { notificationsService } from "./notifications";

export interface Lesson {
  id: string;
  title: string;
  description: string;
  level: "beginner" | "intermediate" | "advanced";
  category: string;
  duration: number; // in minutes
  content: LessonContent[];
  prerequisites?: string[];
  objectives: string[];
}

export interface LessonContent {
  id: string;
  type: "text" | "vocabulary" | "grammar" | "exercise" | "quiz";
  title: string;
  content: any;
  order: number;
}

export interface VocabularySet {
  id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  words: Word[];
  createdAt: number;
}

export interface GrammarRule {
  id: string;
  title: string;
  description: string;
  examples: string[];
  category: string;
  level: string;
  difficulty: number;
}

export interface Exercise {
  id: string;
  title: string;
  type: "multiple-choice" | "fill-blank" | "translation" | "matching";
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
  hints?: string[];
  difficulty: number;
}

const LESSONS_KEY = "simorgh_lessons";
const VOCABULARY_SETS_KEY = "simorgh_vocabulary_sets";
const GRAMMAR_RULES_KEY = "simorgh_grammar_rules";

export class LearnService {
  private static instance: LearnService;

  static getInstance(): LearnService {
    if (!LearnService.instance) {
      LearnService.instance = new LearnService();
    }
    return LearnService.instance;
  }

  async getLessons(level?: string, category?: string): Promise<Lesson[]> {
    try {
      const stored = await AsyncStorage.getItem(LESSONS_KEY);
      let lessons: Lesson[] = stored ? JSON.parse(stored) : this.getDefaultLessons();
      
      if (level) {
        lessons = lessons.filter(lesson => lesson.level === level);
      }
      
      if (category) {
        lessons = lessons.filter(lesson => lesson.category === category);
      }
      
      return lessons.sort((a, b) => a.title.localeCompare(b.title));
    } catch (error) {
      console.error("Error loading lessons:", error);
      return [];
    }
  }

  async getLessonById(id: string): Promise<Lesson | null> {
    try {
      const lessons = await this.getLessons();
      return lessons.find(lesson => lesson.id === id) || null;
    } catch (error) {
      console.error("Error loading lesson:", error);
      return null;
    }
  }

  async completeLesson(lessonId: string, score: number, timeSpent: number): Promise<void> {
    try {
      await learnProgressService.updateChapterProgress(lessonId, {
        completed: true,
        score,
        completedAt: Date.now(),
        timeSpent,
      });

      // Send achievement notification if score is good
      if (score >= 80) {
        await notificationsService.sendAchievement(`Completed lesson with ${score}% score!`);
      }

      // Record study session
      await learnProgressService.recordStudySession(timeSpent, 1);
    } catch (error) {
      console.error("Error completing lesson:", error);
    }
  }

  async getVocabularySets(category?: string, level?: string): Promise<VocabularySet[]> {
    try {
      const stored = await AsyncStorage.getItem(VOCABULARY_SETS_KEY);
      let sets: VocabularySet[] = stored ? JSON.parse(stored) : this.getDefaultVocabularySets();
      
      if (category) {
        sets = sets.filter(set => set.category === category);
      }
      
      if (level) {
        sets = sets.filter(set => set.level === level);
      }
      
      return sets.sort((a, b) => a.title.localeCompare(b.title));
    } catch (error) {
      console.error("Error loading vocabulary sets:", error);
      return [];
    }
  }

  async getVocabularySetById(id: string): Promise<VocabularySet | null> {
    try {
      const sets = await this.getVocabularySets();
      return sets.find(set => set.id === id) || null;
    } catch (error) {
      console.error("Error loading vocabulary set:", error);
      return null;
    }
  }

  async createVocabularySet(
    title: string,
    description: string,
    category: string,
    level: string,
    words: Word[]
  ): Promise<string> {
    try {
      const setId = Date.now().toString();
      const set: VocabularySet = {
        id: setId,
        title,
        description,
        category,
        level,
        words,
        createdAt: Date.now(),
      };

      const sets = await this.getVocabularySets();
      sets.push(set);
      
      await AsyncStorage.setItem(VOCABULARY_SETS_KEY, JSON.stringify(sets));
      return setId;
    } catch (error) {
      console.error("Error creating vocabulary set:", error);
      throw error;
    }
  }

  async practiceVocabulary(setId: string, correctCount: number, totalCount: number): Promise<void> {
    try {
      const set = await this.getVocabularySetById(setId);
      if (!set) return;

      // Update progress for each word
      for (const word of set.words) {
        await learningService.updateFlashcard(word.id, {
          reviewCount: 1,
          correctCount: Math.random() < (correctCount / totalCount) ? 1 : 0,
          nextReview: Date.now() + (24 * 60 * 60 * 1000), // Next day
        });
      }

      // Record study session
      await learnProgressService.recordStudySession(10, totalCount);

      // Send achievement if performance is good
      const accuracy = (correctCount / totalCount) * 100;
      if (accuracy >= 80) {
        await notificationsService.sendAchievement(`Vocabulary practice: ${accuracy.toFixed(0)}% accuracy!`);
      }
    } catch (error) {
      console.error("Error practicing vocabulary:", error);
    }
  }

  async getGrammarRules(category?: string, level?: string): Promise<GrammarRule[]> {
    try {
      const stored = await AsyncStorage.getItem(GRAMMAR_RULES_KEY);
      let rules: GrammarRule[] = stored ? JSON.parse(stored) : this.getDefaultGrammarRules();
      
      if (category) {
        rules = rules.filter(rule => rule.category === category);
      }
      
      if (level) {
        rules = rules.filter(rule => rule.level === level);
      }
      
      return rules.sort((a, b) => a.difficulty - b.difficulty);
    } catch (error) {
      console.error("Error loading grammar rules:", error);
      return [];
    }
  }

  async getGrammarRuleById(id: string): Promise<GrammarRule | null> {
    try {
      const rules = await this.getGrammarRules();
      return rules.find(rule => rule.id === id) || null;
    } catch (error) {
      console.error("Error loading grammar rule:", error);
      return null;
    }
  }

  async getExercises(lessonId?: string, difficulty?: number): Promise<Exercise[]> {
    try {
      // In a real implementation, this would fetch exercises based on lesson
      // For now, return default exercises
      return this.getDefaultExercises(lessonId, difficulty);
    } catch (error) {
      console.error("Error loading exercises:", error);
      return [];
    }
  }

  async submitExercise(exerciseId: string, answer: string): Promise<{
    correct: boolean;
    correctAnswer: string;
    explanation?: string;
  }> {
    try {
      const exercises = await this.getExercises();
      const exercise = exercises.find(e => e.id === exerciseId);
      
      if (!exercise) {
        throw new Error("Exercise not found");
      }

      const correct = answer.toLowerCase().trim() === exercise.correctAnswer.toLowerCase().trim();
      
      return {
        correct,
        correctAnswer: exercise.correctAnswer,
        explanation: exercise.explanation,
      };
    } catch (error) {
      console.error("Error submitting exercise:", error);
      throw error;
    }
  }

  async getRecommendedLessons(userLevel: string): Promise<Lesson[]> {
    try {
      const lessons = await this.getLessons(userLevel);
      const completedLessons = await this.getCompletedLessons();
      
      // Filter out completed lessons and recommend next ones
      return lessons.filter(lesson => 
        !completedLessons.includes(lesson.id) &&
        (!lesson.prerequisites || lesson.prerequisites.every(prereq => completedLessons.includes(prereq)))
      ).slice(0, 5); // Return top 5 recommendations
    } catch (error) {
      console.error("Error getting recommended lessons:", error);
      return [];
    }
  }

  async getLearningPath(userLevel: string): Promise<{
    current: Lesson | null;
    next: Lesson[];
    completed: Lesson[];
  }> {
    try {
      const allLessons = await this.getLessons(userLevel);
      const completedLessonIds = await this.getCompletedLessons();
      
      const completed = allLessons.filter(lesson => completedLessonIds.includes(lesson.id));
      const incomplete = allLessons.filter(lesson => !completedLessonIds.includes(lesson.id));
      
      const current = incomplete.find(lesson => 
        !lesson.prerequisites || lesson.prerequisites.every(prereq => completedLessonIds.includes(prereq))
      ) || null;
      
      const next = incomplete.filter(lesson => 
        lesson.id !== current?.id &&
        (!lesson.prerequisites || lesson.prerequisites.every(prereq => completedLessonIds.includes(prereq)))
      ).slice(0, 3);

      return { current, next, completed };
    } catch (error) {
      console.error("Error getting learning path:", error);
      return { current: null, next: [], completed: [] };
    }
  }

  private async getCompletedLessons(): Promise<string[]> {
    try {
      const progress = await learnProgressService.getProgressSummary();
      // This would typically come from chapter progress
      return [];
    } catch (error) {
      console.error("Error getting completed lessons:", error);
      return [];
    }
  }

  private getDefaultLessons(): Lesson[] {
    return [
      {
        id: "lesson-1",
        title: "Basic German Greetings",
        description: "Learn essential German greetings and introductions",
        level: "beginner",
        category: "basics",
        duration: 15,
        content: [],
        objectives: ["Master basic greetings", "Introduce yourself in German"],
      },
      {
        id: "lesson-2",
        title: "German Numbers 1-100",
        description: "Learn to count and use numbers in German",
        level: "beginner",
        category: "basics",
        duration: 20,
        content: [],
        prerequisites: ["lesson-1"],
        objectives: ["Count from 1-100", "Use numbers in everyday situations"],
      },
    ];
  }

  private getDefaultVocabularySets(): VocabularySet[] {
    return [
      {
        id: "vocab-1",
        title: "Basic Greetings",
        description: "Essential German greetings and farewells",
        category: "basics",
        level: "beginner",
        words: [],
        createdAt: Date.now(),
      },
    ];
  }

  private getDefaultGrammarRules(): GrammarRule[] {
    return [
      {
        id: "grammar-1",
        title: "German Articles",
        description: "Understanding der, die, das",
        examples: ["der Mann", "die Frau", "das Kind"],
        category: "grammar",
        level: "beginner",
        difficulty: 1,
      },
    ];
  }

  private getDefaultExercises(lessonId?: string, difficulty?: number): Exercise[] {
    return [
      {
        id: "exercise-1",
        title: "Choose the correct article",
        type: "multiple-choice",
        question: "___ Mann (the man)",
        options: ["der", "die", "das"],
        correctAnswer: "der",
        explanation: "Der is the masculine article in German",
        difficulty: 1,
      },
    ];
  }
}

export const learnService = LearnService.getInstance();

// Export individual functions for convenience
export const getLessons = (level?: string, category?: string) => learnService.getLessons(level, category);
export const getLessonById = (id: string) => learnService.getLessonById(id);
export const completeLesson = (lessonId: string, score: number, timeSpent: number) => 
  learnService.completeLesson(lessonId, score, timeSpent);
export const getVocabularySets = (category?: string, level?: string) => 
  learnService.getVocabularySets(category, level);
export const practiceVocabulary = (setId: string, correctCount: number, totalCount: number) => 
  learnService.practiceVocabulary(setId, correctCount, totalCount);
export const getGrammarRules = (category?: string, level?: string) => 
  learnService.getGrammarRules(category, level);
export const getExercises = (lessonId?: string, difficulty?: number) => 
  learnService.getExercises(lessonId, difficulty);
export const submitExercise = (exerciseId: string, answer: string) => 
  learnService.submitExercise(exerciseId, answer);
export const getRecommendedLessons = (userLevel: string) => 
  learnService.getRecommendedLessons(userLevel);
export const getLearningPath = (userLevel: string) => learnService.getLearningPath(userLevel);
