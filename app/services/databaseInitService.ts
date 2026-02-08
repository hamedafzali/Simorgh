import { database, DB_NAME } from "../database";
import { Alert } from "react-native";

export class DatabaseInitService {
  private static instance: DatabaseInitService;
  private isInitialized = false;

  static getInstance(): DatabaseInitService {
    if (!DatabaseInitService.instance) {
      DatabaseInitService.instance = new DatabaseInitService();
    }
    return DatabaseInitService.instance;
  }

  async initializeDatabase(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      // Check if database exists
      const dbExists = await database.databaseExists();

      if (!dbExists) {
        console.log("Database does not exist - prompting user for download");
        await this.promptDatabaseDownload();
      } else {
        console.log("Database exists - initializing");
        await database.init();

        // Check if database has data
        const hasData = await database.databaseHasData();
        if (!hasData) {
          console.log(
            "Database exists but is empty - prompting user for download"
          );
          await this.promptDatabaseDownload();
        }
      }

      this.isInitialized = true;
      console.log("Database initialization completed");
    } catch (error) {
      console.error("Database initialization failed:", error);
      throw error;
    }
  }

  private async promptDatabaseDownload(): Promise<void> {
    return new Promise((resolve) => {
      Alert.alert(
        "Database Required",
        "No vocabulary database found. Would you like to download the latest vocabulary database to get started?",
        [
          {
            text: "Download",
            onPress: async () => {
              try {
                console.log("User chose to download database");
                await this.downloadAndSetupDatabase();
                resolve();
              } catch (error) {
                console.error("Database download failed:", error);
                this.showDownloadFailedDialog(resolve);
              }
            },
          },
          {
            text: "Start Empty",
            onPress: async () => {
              try {
                console.log("User chose to start with empty database");
                await this.createEmptyDatabase();
                resolve();
              } catch (error) {
                console.error("Failed to create empty database:", error);
                resolve(); // Still resolve to allow app to continue
              }
            },
            style: "cancel",
          },
        ]
      );
    });
  }

  private async downloadAndSetupDatabase(): Promise<void> {
    try {
      console.log("Starting database download...");

      // Initialize empty database first
      await database.init();

      // Download database from backend
      const downloadSuccess = await database.downloadDatabase();

      if (downloadSuccess) {
        console.log("Database downloaded successfully");
        // In a real implementation, you would import the downloaded data here
        // For now, we'll just work with the empty database
      } else {
        throw new Error("Download failed");
      }
    } catch (error) {
      console.error("Database download failed:", error);
      throw error;
    }
  }

  private async createEmptyDatabase(): Promise<void> {
    try {
      console.log("Creating empty database...");
      await database.init();
      console.log("Empty database created successfully");
    } catch (error) {
      console.error("Failed to create empty database:", error);
      throw error;
    }
  }

  private showDownloadFailedDialog(resolve: () => void): void {
    Alert.alert(
      "Download Failed",
      "Failed to download the database. Would you like to try again or start with an empty database?",
      [
        {
          text: "Try Again",
          onPress: async () => {
            try {
              await this.downloadAndSetupDatabase();
              resolve();
            } catch (error) {
              console.error("Retry download failed:", error);
              this.showDownloadFailedDialog(resolve);
            }
          },
        },
        {
          text: "Start Empty",
          onPress: async () => {
            try {
              await this.createEmptyDatabase();
              resolve();
            } catch (error) {
              console.error("Failed to create empty database:", error);
              resolve(); // Still resolve to allow app to continue
            }
          },
          style: "cancel",
        },
      ]
    );
  }

  async isDatabaseReady(): Promise<boolean> {
    try {
      const dbExists = await database.databaseExists();
      if (!dbExists) return false;

      const hasData = await database.databaseHasData();
      return hasData;
    } catch (error) {
      console.error("Error checking database readiness:", error);
      return false;
    }
  }
}

export const databaseInitService = DatabaseInitService.getInstance();
