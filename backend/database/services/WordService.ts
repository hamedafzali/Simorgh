import { DatabaseConfig } from "../config/database";
import Word, { IWord } from "../models/Word";

export class WordService {
  private db: DatabaseConfig;

  constructor() {
    this.db = DatabaseConfig.getInstance();
  }

  async createWord(wordData: Partial<IWord>): Promise<IWord> {
    try {
      const word = new Word(wordData);
      return await word.save();
    } catch (error) {
      throw new Error(`Failed to create word: ${error}`);
    }
  }

  async getWordsByLevel(level: string): Promise<IWord[]> {
    try {
      return await Word.find({ level }).sort({ frequencyScore: -1 });
    } catch (error) {
      throw new Error(`Failed to get words by level: ${error}`);
    }
  }

  async getWordsByType(wordType: string): Promise<IWord[]> {
    try {
      return await Word.find({ wordType }).sort({ frequencyScore: -1 });
    } catch (error) {
      throw new Error(`Failed to get words by type: ${error}`);
    }
  }

  async searchWords(
    query: string,
    filters?: {
      level?: string;
      wordType?: string;
      tags?: string[];
    }
  ): Promise<IWord[]> {
    try {
      const searchQuery: any = {
        $or: [
          { word: { $regex: query, $options: "i" } },
          { "translations.text": { $regex: query, $options: "i" } },
        ],
      };

      if (filters?.level) {
        searchQuery.level = filters.level;
      }
      if (filters?.wordType) {
        searchQuery.wordType = filters.wordType;
      }
      if (filters?.tags && filters.tags.length > 0) {
        searchQuery.tags = { $in: filters.tags };
      }

      return await Word.find(searchQuery).sort({ frequencyScore: -1 });
    } catch (error) {
      throw new Error(`Failed to search words: ${error}`);
    }
  }

  async getWordById(id: string): Promise<IWord | null> {
    try {
      return await Word.findById(id).populate("relatedWords");
    } catch (error) {
      throw new Error(`Failed to get word by ID: ${error}`);
    }
  }

  async getRandomWords(count: number, level?: string): Promise<IWord[]> {
    try {
      const query = level ? { level } : {};
      return await Word.aggregate([
        { $match: query },
        { $sample: { size: count } },
      ]);
    } catch (error) {
      throw new Error(`Failed to get random words: ${error}`);
    }
  }

  async updateWord(
    id: string,
    updateData: Partial<IWord>
  ): Promise<IWord | null> {
    try {
      return await Word.findByIdAndUpdate(id, updateData, { new: true });
    } catch (error) {
      throw new Error(`Failed to update word: ${error}`);
    }
  }

  async deleteWord(id: string): Promise<boolean> {
    try {
      const result = await Word.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      throw new Error(`Failed to delete word: ${error}`);
    }
  }

  async getWordsWithFrequency(
    minFrequency: number,
    maxFrequency?: number
  ): Promise<IWord[]> {
    try {
      const query: any = { frequencyScore: { $gte: minFrequency } };
      if (maxFrequency) {
        query.frequencyScore.$lte = maxFrequency;
      }
      return await Word.find(query).sort({ frequencyScore: -1 });
    } catch (error) {
      throw new Error(`Failed to get words by frequency: ${error}`);
    }
  }

  async addRelatedWord(
    wordId: string,
    relatedWordId: string
  ): Promise<IWord | null> {
    try {
      return await Word.findByIdAndUpdate(
        wordId,
        { $addToSet: { relatedWords: relatedWordId } },
        { new: true }
      );
    } catch (error) {
      throw new Error(`Failed to add related word: ${error}`);
    }
  }

  async getWordStatistics(): Promise<{
    totalWords: number;
    wordsByLevel: Record<string, number>;
    wordsByType: Record<string, number>;
  }> {
    try {
      const stats = await Word.aggregate([
        {
          $group: {
            _id: null,
            totalWords: { $sum: 1 },
            wordsByLevel: {
              $push: {
                k: "$level",
                v: 1,
              },
            },
            wordsByType: {
              $push: {
                k: "$wordType",
                v: 1,
              },
            },
          },
        },
        {
          $project: {
            totalWords: 1,
            wordsByLevel: {
              $arrayToObject: "$wordsByLevel",
            },
            wordsByType: {
              $arrayToObject: "$wordsByType",
            },
          },
        },
      ]);

      return (
        stats[0] || {
          totalWords: 0,
          wordsByLevel: {},
          wordsByType: {},
        }
      );
    } catch (error) {
      throw new Error(`Failed to get word statistics: ${error}`);
    }
  }
}

export default new WordService();
