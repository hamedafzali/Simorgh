# Database Architecture and API Usage Rules

## Overview

The Simorgh app uses an **offline-first architecture** with a local SQLite database as the primary data source. The backend API is used only for database updates and synchronization.

## Database Structure

### Local SQLite Database (`simorgh_local.db`)

The app uses `expo-sqlite` for local data storage with the following tables:

#### Words Table

- **id**: string (primary key)
- **german**: string (German word)
- **english**: string (English translation)
- **article**: string (optional grammatical article)
- **wordType**: string (noun, verb, adjective, etc.)
- **level**: string (A1, A2, B1, B2, C1, C2)
- **frequency**: number (usage frequency)
- **examples**: string (example sentences)
- **category**: string (word category)
- **phonetic**: string (optional phonetic transcription)
- **translations**: string (JSON array of translations)
- **definitions**: string (JSON array of definitions)
- **tags**: string (JSON array of tags)
- **createdAt**: string (ISO timestamp)
- **updatedAt**: string (ISO timestamp)

#### Flashcards Table

- **id**: string (primary key)
- **front**: string (front side text)
- **back**: string (back side text)
- **type**: string (card type)
- **level**: string (difficulty level)
- **category**: string (card category)
- **wordId**: string (optional reference to words table)
- **nextReview**: number (timestamp for next review)
- **reviewCount**: number (number of times reviewed)
- **difficulty**: number (SM-2 algorithm difficulty)
- **interval**: number (SM-2 algorithm interval)
- **easeFactor**: number (SM-2 algorithm ease factor)
- **createdAt**: string (ISO timestamp)
- **updatedAt**: string (ISO timestamp)

#### Exams Table

- **id**: string (primary key)
- **title**: string (exam title)
- **description**: string (exam description)
- **level**: string (difficulty level)
- **category**: string (exam category)
- **duration**: number (exam duration in minutes)
- **questionCount**: number (number of questions)
- **passingScore**: number (minimum score to pass)
- **maxAttempts**: number (maximum allowed attempts)
- **questions**: string (JSON array of questions)
- **instructions**: string (exam instructions)
- **isActive**: boolean (whether exam is active)
- **createdAt**: string (ISO timestamp)
- **updatedAt**: string (ISO timestamp)

## API Usage Rules

### **IMPORTANT: All app modules MUST use local database**

1. **Primary Data Source**: All app modules (vocabulary, flashcards, exams, practice, learn) must use the local SQLite database for all data operations.

2. **API Usage**: The backend API is used **ONLY** for:

   - Downloading the latest database file when local database doesn't exist
   - Checking for database updates
   - Database version management

3. **No Direct API Calls**: App screens should **NEVER** make direct API calls for data retrieval. All data access goes through the `DatabaseService` class.

4. **Fallback Mechanism**: When SQLite operations fail, the app automatically falls back to mock data to ensure functionality.

## Database Service Architecture

### DatabaseService Class

The `DatabaseService` class provides a centralized interface for all database operations:

- **Singleton Pattern**: Prevents multiple database initializations
- **Error Handling**: Comprehensive error handling with fallback to mock data
- **Type Safety**: Full TypeScript support with proper interfaces
- **Async Operations**: All database operations are asynchronous

### Key Methods

- `getWords()`: Retrieve words with optional filtering
- `getFlashcards()`: Retrieve flashcards with optional filtering
- `getExams()`: Retrieve exams with optional filtering
- `getWordById()`: Get a specific word by ID
- `getFlashcardById()`: Get a specific flashcard by ID
- `getExamById()`: Get a specific exam by ID
- `updateFlashcard()`: Update flashcard review data
- `saveExamResult()`: Save exam completion results

## Error Handling and Fallbacks

### SQLite Error Handling

When SQLite operations fail (e.g., "runAsync function has failed"), the app:

1. **Logs the error** for debugging
2. **Falls back to mock data** to maintain app functionality
3. **Continues operation** without crashing

### Mock Data Structure

Mock data provides realistic content for:

- German words with translations and examples
- Flashcards for spaced repetition learning
- Exams for knowledge testing

## Data Synchronization

### Database Updates

1. **Initialization**: When app starts, checks if local database exists
2. **Download**: If no local database, downloads from backend
3. **Updates**: Periodically checks for database version updates
4. **Fallback**: Uses existing local database if update fails

### Offline Support

The app is designed to work completely offline:

- All core functionality works without network connection
- Local database ensures data persistence
- Mock data provides fallback when database operations fail

## Performance Considerations

### Database Optimization

- **Indexes**: Created on frequently queried fields (level, category)
- **Lazy Loading**: Data loaded only when needed
- **Caching**: Results cached where appropriate
- **Connection Management**: Single database instance reused

### Memory Management

- **Connection Pooling**: Database connection properly managed
- **Resource Cleanup**: Database connections closed when app exits
- **Error Recovery**: Automatic recovery from database errors

## Development Guidelines

### Adding New Features

1. **Always use DatabaseService**: Never bypass the database service
2. **Add mock data**: Include fallback data for new features
3. **Handle errors gracefully**: Ensure app continues working
4. **Update interfaces**: Maintain TypeScript type safety
5. **Test offline**: Verify features work without network

### Database Schema Changes

1. **Update interfaces**: Modify TypeScript interfaces
2. **Update mock data**: Add corresponding mock data
3. **Handle migrations**: Ensure backward compatibility
4. **Test thoroughly**: Verify all database operations

## Troubleshooting

### Common Issues

1. **"runAsync function has failed"**: Handled with fallback to mock data
2. **Database not initialized**: Automatic initialization with retry logic
3. **TypeScript errors**: Ensure proper interface definitions
4. **Missing data**: Mock data provides fallback content

### Debugging

- **Console logs**: Detailed logging for database operations
- **Error messages**: Clear error reporting with context
- **Fallback indicators**: Logs when using mock data
- **Performance metrics**: Query execution time logging
