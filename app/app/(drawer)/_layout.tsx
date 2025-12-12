# Centralized Theme System

This document explains the new centralized theme management system implemented for the app.

## Overview

The app now uses a centralized theme system that provides:

- **Global Theme State**: Managed through React Context
- **Automatic Persistence**: Theme preference saved to AsyncStorage
- **Easy Access**: Simple hook for any component to use theme
- **Consistent Colors**: All components use the same theme source

## Files Created

### 1. `/contexts/theme-context.tsx`

**Purpose**: Central theme provider and context
**Features**:

- `ThemeProvider`: Wraps the app and provides theme state
- `useTheme`: Hook to access theme state and toggle function
- Automatic theme persistence with AsyncStorage
- Dynamic color generation using existing theme system

**Usage**:

```tsx
import { useTheme } from "@/contexts/theme-context";

const { isDarkMode, toggleTheme, colors } = useTheme();
```

### 2. `/hooks/use-app-theme.ts`

**Purpose**: Convenience hook that combines theme context with existing theme system
**Features**:

- Access to theme state (`isDarkMode`, `isLight`)
- Access to theme colors (`colors`)
- Access to color getter function (`getColor`)
- Toggle theme function (`toggleTheme`)

**Usage**:

```tsx
import { useAppTheme } from "@/hooks/use-app-theme";

const { isDarkMode, toggleTheme, colors, isDark, isLight } = useAppTheme();
```

## Integration

### Root Layout (`app/_layout.tsx`)

The app is wrapped with both theme providers:

```tsx
<ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
  <AppThemeProvider>{/* App content */}</AppThemeProvider>
</ThemeProvider>
```

### Component Usage

Instead of individual `useThemeColor` calls, components now use:

```tsx
// Before
const backgroundColor = useThemeColor({}, "background") as string;
const textColor = useThemeColor({}, "text") as string;
const cardBackgroundColor = useThemeColor({}, "card") as string;

// After
const { colors, isDarkMode, toggleTheme } = useAppTheme();
// Use: colors.background, colors.text, colors.card
```

## Benefits

### 1. **Centralized Management**

- Single source of truth for theme state
- Easy to modify theme behavior globally
- Consistent theme updates across all components

### 2. **Simplified API**

- No need for multiple `useThemeColor` calls
- Cleaner component code
- Better TypeScript support

### 3. **Automatic Persistence**

- Theme preference automatically saved
- Persists across app restarts
- No manual storage management needed in components

### 4. **Easy Toggle**

- Simple `toggleTheme()` function
- Updates all components automatically
- Handles persistence internally

## Migration Guide

### For Existing Components

1. Replace individual `useThemeColor` imports with `useAppTheme`
2. Replace individual color variables with `colors.colorName`
3. Replace manual theme toggle with `toggleTheme()`

### Example Migration

```tsx
// Before
import { useThemeColor } from "@/hooks/use-theme-color";
import { updateTheme } from "@/hooks/use-color-scheme";

const backgroundColor = useThemeColor({}, "background") as string;
const textColor = useThemeColor({}, "text") as string;

const handleToggle = () => {
  const newTheme = !isDark;
  updateTheme(newTheme ? "dark" : "light");
  AsyncStorage.setItem("Simorgh.darkMode", newTheme.toString());
};

// After
import { useAppTheme } from "@/hooks/use-app-theme";

const { colors, toggleTheme } = useAppTheme();
// Use: colors.background, colors.text

const handleToggle = () => {
  toggleTheme(); // Handles everything automatically
};
```

## Theme Colors Available

```tsx
colors = {
  background: string, // Main background color
  text: string, // Primary text color
  card: string, // Card background color
  border: string, // Border color
  primary: string, // Primary accent color
  textMuted: string, // Muted/secondary text color
};
```

## Implementation Status

✅ **Completed**:

- ThemeProvider context created
- useAppTheme hook created
- Root layout updated
- Settings page migrated
- Automatic persistence working

🔄 **In Progress**:

- Migrating other pages to use centralized theme
- Updating components to use new API

## Next Steps

1. Update remaining pages to use `useAppTheme`
2. Remove individual `useThemeColor` calls from components
3. Add theme transition animations
4. Create theme customization options

This centralized system makes theme management much cleaner and more maintainable!
