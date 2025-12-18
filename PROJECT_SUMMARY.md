# Simorgh Connect - Project Summary

## Overview

**Simorgh Connect** is a mobile-first community application designed specifically for the Iranian community residing in Germany. The app combines German language learning features with community support services including job listings, events, and document management, while maintaining full Persian (RTL) and German (LTR) language support with equal quality and consistency.

**Project Type**: Full-stack mobile application  
**Version**: 1.0.0  
**License**: MIT  
**Team**: Simorgh Team

---

## Architecture

### Technology Stack

#### Frontend (Mobile App)

- **Framework**: React Native with Expo (~54.0.0)
- **Language**: TypeScript
- **Routing**: Expo Router (~6.0.19)
- **State Management**: React Context API
- **Internationalization**: i18next (Persian, German, English)
- **Storage**: SQLite (offline storage, local cache)
- **UI Libraries**: Custom themed components with modern European design aesthetic

#### Backend

- **Framework**: Node.js with Express
- **Language**: JavaScript/TypeScript (mixed)
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT (jsonwebtoken)
- **Security**: Helmet, CORS
- **Real-time**: Socket.io (configured but not fully implemented)

#### Admin Panel

- **Framework**: React
- **UI Library**: Ant Design (mentioned in structure docs)
- **Deployment**: Served as static files from Express backend

---

## Project Structure

```
Simorgh/
├── app/                          # React Native mobile application
│   ├── app/                      # Expo Router pages
│   ├── components/              # Reusable UI components
│   │   └── ui/                  # Modern UI components (cards, buttons, inputs)
│   ├── services/                # Business logic and API services
│   ├── database/                # Local database (AsyncStorage-based)
│   ├── hooks/                   # Custom React hooks
│   ├── contexts/                # React Context providers
│   ├── constants/               # Constants and theme definitions
│   ├── i18n/                    # Internationalization config and locales
│   └── config/                  # App configuration
│
├── backend/                      # Node.js/Express backend
│   ├── src/                     # Server code
│   │   ├── routes/             # API route handlers
│   │   └── server.js           # Main server file
│   ├── database/               # MongoDB models and schemas
│   │   ├── models/            # Mongoose models (Word, Flashcard, Exam, etc.)
│   │   └── seed/              # Database seeding scripts
│   ├── services/              # Backend business logic
│   └── admin/                 # React admin panel (built static files)
│
└── package.json                # Root workspace configuration
```

---

## Core Features

### 1. Language Learning

#### Vocabulary Management

- **Word Database**: Comprehensive German vocabulary with:
  - Word types: nouns, verbs, adjectives, adverbs, prepositions, conjunctions, pronouns, interjections
  - CEFR levels: A1, A2, B1, B2, C1, C2
  - Articles: der, die, das, ein, eine
  - Translations: Multi-language support (English, Farsi)
  - Phonetics, definitions, examples
  - Conjugations for verbs
  - Related words and tags
  - Audio files support

#### Flashcards System

- **Spaced Repetition Algorithm**: SM-2 algorithm implementation
- **Features**:
  - Front/back text with hints
  - Difficulty levels (1-5)
  - Review tracking (review count, success rate)
  - Next review scheduling
  - Interval and ease factor management
  - User-specific decks
  - Active/inactive status
- **Integration**: Linked to word database via `wordId`

#### Exams & Assessments

- **Exam Types**: Practice, Mock, Certification
- **Sections**: Reading, Writing, Listening, Speaking, Grammar, Vocabulary
- **Features**:
  - Multiple difficulty levels (A1-C2)
  - Time limits and passing scores
  - Question tracking and scoring
  - Attempt limits
  - Category-based organization
  - Active/inactive status

#### Exercises

- **Types**: Multiple-choice, fill-in-the-blank, translation, matching
- **Features**:
  - Difficulty scoring
  - Hints and explanations
  - Level-based filtering
  - Category organization

#### Learning Progress

- **Tracking**:
  - Mastered words count
  - Accuracy percentage
  - Streak days
  - Total reviews
  - Current level assessment
  - Grammar progress by topic
  - Exam results and scores
- **Analytics**: Learning statistics and recommendations

### 2. Community Features

#### Job Listings

- Job application management
- Job search functionality
- Integration with backend services

#### Events

- Community events management
- Event listings and details
- Multi-language event descriptions

#### Documents

- Document form management
- Document storage and organization
- Integration with learning content

#### Community Locations

- Location-based services
- Community map integration
- Regional information

### 3. User Interface

#### Design System

- **Design Principles**: Minimalist yet warm visual language, contemporary European product design aesthetic
- **Color System**:
  - Primary Blue: #1F3A5F (brand anchor, trust)
  - Primary Blue Light: #2F5D8A (interactive states)
  - Accent Green: #2FA36B (community, growth)
  - App Background: #F7F9FC
  - Surface/Card Background: #FFFFFF
  - Primary Text: #1E293B, Secondary Text: #64748B
- **Typography**: "Inter", "Vazirmatn", system-ui (supports Persian and Latin)
- **Components**: Custom UI library with:
  - Cards (16px radius, white background, subtle shadows)
  - Buttons (48px height, 14px radius, proper states)
  - Form inputs (48px height, 12px radius, focus states)
  - Bottom navigation (64px height, center-aligned)
- **RTL/LTR Support**: Full bidirectional language support
- **Accessibility**: WCAG AA compliance, 44px minimum tap targets

#### Navigation

- **Drawer Navigation**: AppDrawerLayout component
- **Routing**: Expo Router with typed routes
- **Pages**:
  - Home screen
  - Learning interface
  - Quiz/exam screens
  - Chat interface
  - Documents form
  - Community features

### 4. Internationalization

#### Supported Languages

- **Persian/Farsi** (fa) - Primary language for Iranian community
- **German** (de) - Target language for learning
- **English** (en) - Secondary support language

#### Translation Files

- `en.json`, `de.json`, `fa.json` - Main translations
- `phrases.json` - Common phrases
- `events.json` - Event-related translations
- `jobs.json` - Job-related translations

#### Features

- Language persistence (AsyncStorage)
- Device language detection
- Runtime language switching

### 5. Offline Support

#### SQLite Database

- **Storage**: SQLite database for offline storage and local cache
- **Schema**:
  - Exams table
  - Flashcards table
  - Words table
  - User settings table
  - Exam results table
  - Sync tracking table
- **Versioning**: Database version tracking for sync with MongoDB backend

#### Sync Service

- **Features**:
  - Online/offline status detection
  - Automatic sync (configurable interval)
  - Manual sync trigger
  - Conflict resolution
  - Pending changes tracking
  - Last sync timestamp

### 6. Chat Interface

- Chat component implemented
- Backend chat service available
- Language-specific chat support

### 7. Notifications

- Notification service implemented
- Achievement notifications
- Study reminders
- Progress notifications

---

## Database Models

### Backend (MongoDB)

#### Word Model

- Comprehensive vocabulary with articles, types, levels
- Translations, definitions, conjugations
- Audio files, related words, tags
- Indexed for performance (word, level, wordType, frequencyScore, tags)

#### Flashcard Model

- Linked to Word model via `wordId`
- Spaced repetition algorithm fields
- User-specific tracking
- Indexed for performance (userId, nextReview, deck, difficultyLevel, tags)

#### Exam Model

- Multi-section exam structure
- Level-based (A1-C2)
- Time limits, passing scores
- Exercise references
- Indexed for performance (level, examType, isActive)

#### Exercise Model

- Various exercise types
- Difficulty scoring
- Level and category organization

#### UserProgress Model

- Learning statistics
- Mastered words tracking
- Exam results
- Grammar progress
- Streak tracking

#### Grammar Model

- Grammar rules and explanations
- Examples and difficulty levels

### Frontend (Local Storage)

#### SQLite Database

- **Purpose**: Offline storage, local cache
- **Sync**: API-based synchronization with MongoDB backend
- **Schema**:
  - Exams table
  - Flashcards table
  - Words table
  - User settings table
  - Exam results table
  - Sync tracking table

---

## API Endpoints

### Learning Endpoints

- `GET /api/stats` - Learning statistics
- `GET /api/exercises` - Get exercises (filtered by level, type, category)
- `GET /api/words` - Get words (filtered by level, category)
- `GET /api/words/:id` - Get word by ID
- `GET /api/flashcards` - Get flashcards (filtered by type, due status)
- `PUT /api/flashcards/:id` - Update flashcard
- `GET /api/exams` - Get exams (paginated, filtered by level, category)
- `GET /api/exams/:id` - Get exam by ID with questions
- `POST /api/exams/:id/start` - Start exam session
- `POST /api/exams/:id/submit` - Submit exam results
- `GET /api/categories` - Get learning categories

### Practice Endpoints

- `POST /api/practice/start` - Start practice session
- `POST /api/practice/:sessionId/complete` - Complete practice session

### Seed/Admin Endpoints

- `POST /api/seed` - Seed database
- `POST /api/seed/5000` - Generate 5000 flashcards
- `POST /api/seed/link` - Link flashcards to words
- `POST /api/seed/more` - Generate more flashcards
- `POST /api/seed/exams` - Create improved German exams
- `POST /api/seed/5000exams` - Generate 5000 exams

### Other Endpoints

- `POST /api/chat` - Chat endpoint (placeholder)
- `GET /api/jobs` - Jobs endpoint (placeholder)

---

## Configuration

### Environment

- **Backend Port**: 3001 (default)
- **API Base URL**: `http://localhost:3001/api` (development)
- **MongoDB URI**: `mongodb://localhost:27017/simorgh` (default)
- **Admin Panel**: `http://localhost:3001/admin`

### App Configuration

- **App Name**: Simorgh Connect
- **Slug**: simorgh-connect
- **Scheme**: simorghconnect
- **New Architecture**: Enabled
- **Platforms**: iOS, Android, Web

---

## Development Scripts

### Root Level

- `npm run backend` - Start backend server
- `npm run app` - Start Expo app
- `npm run start:all` - Start both backend and frontend concurrently
- `npm run start:full` - Full startup with cleanup
- `npm run install:all` - Install all dependencies
- `npm run seed` - Seed database
- `npm run seed:exams` - Seed exams
- `npm run seed:flashcards` - Seed flashcards

### Backend

- `npm run dev` - Start with nodemon
- `npm start` - Start production server
- `npm run admin:build` - Build admin panel
- `npm run admin:dev` - Start admin panel in dev mode

### App

- `npm start` - Start Expo
- `npm run android` - Start on Android
- `npm run ios` - Start on iOS
- `npm run web` - Start on web

---

## Key Services

### Frontend Services

- `api.ts` - API client configuration
- `learningService.ts` - Learning content management
- `learn.ts` - Lesson and vocabulary management
- `learnProgress.ts` - Progress tracking
- `local-learning-service.ts` - Local learning service
- `LocalLearningService.ts` - Alternative local service
- `chat.ts` - Chat functionality
- `documents.ts` - Document management
- `jobs.ts` - Job listings
- `notifications.ts` - Notification service

### Backend Services

- `api.ts` - API utilities
- `chat.ts` - Chat service
- `checklists.ts` - Checklist management
- `communityLocations.ts` - Location services
- `content.ts` - Content management
- `documents.ts` - Document service
- `events.ts` - Event management
- `jobApplications.ts` - Job application service
- `jobs.ts` - Job service
- `learn.ts` - Learning service
- `learningService.ts` - Learning content service
- `learnProgress.ts` - Progress tracking service
- `learnTutor.ts` - Tutoring service
- `mockData.ts` - Mock data generation
- `notifications.ts` - Notification service

---

## Database Seeding

### Available Seed Scripts

1. **Basic Seed** (`seedData.js`) - Initial database setup
2. **5000 Flashcards** (`generate5000Flashcards.js`) - Generate large flashcard set
3. **Link Flashcards** (`linkFlashcardsToWords.js`) - Link flashcards to words
4. **More Flashcards** (`generateMoreFlashcards.js`) - Generate additional flashcards
5. **Improved Exams** (`improvedExams.js`) - Create enhanced exam set
6. **5000 Exams** (`generate5000Exams.js`) - Generate large exam set

---

## Styling & Theming

### Theme System

- **Dark/Light Mode**: Automatic theme switching
- **Color Scheme**: Custom color palette
- **Glassmorphism**: Modern glass effect design
- **Responsive**: Screen-size aware styling

### Style Organization

- **Centralized Styles**: `constants/common-styles.ts`
- **Theme Constants**: `constants/theme.ts`
- **Optimization Hooks**: `hooks/use-optimized-styles.ts`
- **Performance**: Memoized styles to prevent recalculation

### Style Categories

- Layout styles
- Header styles
- Card styles
- Button styles
- Input styles
- List styles

---

## Known Issues & TODOs

### Backend

- [ ] SQLite integration (mentioned in APP_STRUCTURE.md)
- [ ] Complete chat implementation
- [ ] Complete jobs API implementation
- [ ] User authentication fully implemented
- [ ] Socket.io real-time features

### Frontend

- [ ] SQLite integration for offline storage (currently using AsyncStorage)
- [ ] Complete sync service implementation
- [ ] Conflict resolution UI
- [ ] Audio playback for word pronunciation
- [ ] Image upload for documents

### Admin Panel

- [ ] Database content management interface
- [ ] User management
- [ ] Content moderation tools
- [ ] Analytics dashboard

---

## Dependencies

### Key Frontend Dependencies

- `expo`: ~54.0.0
- `react`: 19.1.0
- `react-native`: 0.81.5
- `expo-router`: ~6.0.19
- `i18next`: ^23.2.11
- `@react-native-async-storage/async-storage`: 2.2.0
- `@react-navigation/drawer`: ^7.5.0
- `react-native-reanimated`: ~4.1.1

### Key Backend Dependencies

- `express`: ^4.18.2
- `mongoose`: ^7.5.0
- `jsonwebtoken`: ^9.0.2
- `socket.io`: ^4.7.2
- `bcryptjs`: ^2.4.3
- `helmet`: ^7.0.0
- `cors`: ^2.8.5
- `sqlite3`: ^5.1.7

---

## Security Considerations

### Implemented

- Helmet.js for security headers
- CORS configuration
- JWT authentication (configured)
- Environment variables for sensitive data

### Recommendations

- Implement rate limiting
- Add input validation middleware
- Secure file upload handling
- Implement proper error handling (avoid exposing stack traces)
- Add API authentication middleware to protected routes

---

## Performance Optimizations

### Frontend

- Memoized styles to prevent recalculation
- Centralized style system reduces duplication
- Optimized rendering with consistent style references
- Theme-aware styling with hooks

### Backend

- Database indexes on frequently queried fields
- Pagination for large datasets
- Efficient query filtering

---

## Testing

### Current Status

- No test files found in the codebase
- No testing framework configured

### Recommendations

- Add unit tests for services
- Add integration tests for API endpoints
- Add component tests for React Native components
- Add E2E tests for critical user flows

---

## Deployment

### Development

- Backend: `http://localhost:3001`
- Frontend: Expo development server
- MongoDB: Local instance

### Production Considerations

- Environment variable configuration
- Production API URL setup
- MongoDB connection string
- Static file serving for admin panel
- Expo app publishing

---

## Documentation

### Existing Documentation

- `APP_STRUCTURE.md` - Project structure overview
- `STYLE_GUIDE.md` - Styling guidelines and optimization
- `THEME_SYSTEM.md` - Theme system documentation (referenced)

### Missing Documentation

- API documentation
- Component documentation
- Setup/installation guide
- Deployment guide
- Contributing guidelines

---

## Project Status

### Completed Features

✅ Core learning features (words, flashcards, exams)  
✅ Database models and schemas  
✅ Basic API endpoints  
✅ Mobile app structure  
✅ Internationalization  
✅ Theme system  
✅ Local storage  
✅ Admin panel structure

### In Progress

🔄 Sync service implementation  
🔄 Chat functionality  
🔄 Jobs API  
🔄 User authentication

### Planned

📋 SQLite integration  
📋 Complete admin panel features  
📋 Audio playback  
📋 Image upload  
📋 Real-time features

---

## Frontend Page Structure Analysis

### Current Implementation Status

#### Existing Pages

1. **Main Page** (`index.tsx`) - Currently implemented as splash/intro screen

   - Animated logo with circular menu
   - Dual date/time display (Persian/Gregorian)
   - Glass morphism design elements
   - **Issue**: Functions as intro screen, not functional home page

2. **Splash Screen** (`SplashScreen.tsx`) - Basic splash screen
   - Logo and app name display
   - Warm beige background (#F5E6D3)

#### Missing Core Pages

The following pages are **NOT IMPLEMENTED** but referenced in project summary:

### 1. Learning Interface Pages

**Recommended Structure:**

- **Main Learning Page** (`/learn`)

  - Progress overview (level, streak, mastered words)
  - Daily goals and quick actions
  - Integration with `LearningService.getUserLearningStats()`

- **Vocabulary Section** (`/learn/vocabulary`)

  - Word lists by level/category
  - Flashcard review system
  - Word details with definitions/examples
  - Uses `WordService` and `FlashcardService`

- **Grammar Section** (`/learn/grammar`)

  - Grammar topics with rules and examples
  - Interactive exercises
  - Progress tracking by topic
  - Uses `Grammar` model and `getGrammarTopics()`

- **Practice Section** (`/learn/practice`)

  - Multiple exercise types (MCQ, fill-in-blank, translation)
  - Difficulty levels (A1-C2)
  - Instant feedback system
  - Uses `Exercise` model

- **Exams Section** (`/learn/exams`)
  - Mock tests and simulations
  - Section-based assessments
  - Results analysis
  - Uses `Exam` model

### 2. Community Features Pages

- **Chat Interface** - Community discussion forum
- **Job Listings** - Employment opportunities
- **Events** - Community gatherings and workshops
- **Documents** - Immigration document assistance
- **Community Locations** - Location-based services

### 3. User Management Pages

- **Profile** - User settings and progress
- **Settings** - App configuration and preferences

### Backend Services Available

#### Learning Services

- **LearningService** (`learningService.ts`)

  - User statistics and progress tracking
  - Word management and search
  - Flashcard spaced repetition system
  - Grammar topics and exercises
  - Exam management
  - Daily content recommendations

- **Learn Bundle** (`learn.ts`)
  - Daily phrases (German, Persian, English)
  - Vocabulary items by category
  - Bilingual reading materials
  - AsyncStorage-based local caching

#### Other Services

- **Chat Service** - Community chat functionality
- **Jobs Service** - Job listings and applications
- **Events Service** - Community event management
- **Documents Service** - Document form management
- **Notifications Service** - Achievement and reminder notifications

### Implementation Requirements

#### Frontend Integration Needs

1. **API Integration**: Connect frontend to backend services
2. **State Management**: Implement proper React Context for learning progress
3. **Offline Support**: SQLite integration for local caching
4. **RTL/LTR Support**: Full bidirectional language support
5. **Design System**: Follow Style.md specifications
6. **Navigation**: Implement bottom navigation and routing

#### Technical Debt

- Current `index.tsx` needs to be converted from splash screen to functional home page
- Missing navigation structure between pages
- No integration between frontend components and backend services
- Theme system exists but not fully implemented across components

---

## Notes

- The project uses a mixed JavaScript/TypeScript approach (backend primarily JS, frontend primarily TS)
- Some services have duplicate implementations (e.g., `local-learning-service.ts` and `LocalLearningService.ts`)
- The sync service has mock implementations that need to be completed
- The admin panel is built but may need additional features
- Database seeding scripts are extensive and can generate large datasets (5000+ items)

---

## Contact & Support

**Project**: Simorgh Connect  
**Team**: Simorgh Team  
**License**: MIT

---

_Last Updated: Based on current codebase review_  
_This summary should be reviewed and updated as the project evolves_
