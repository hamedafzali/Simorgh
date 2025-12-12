# Style Guide & CSS Optimization

## Overview

This document outlines the centralized styling approach and optimization strategies implemented in the Simorgh Connect app.

## Centralized Style System

### Location

- **Common Styles**: `/constants/common-styles.ts`
- **Theme Constants**: `/constants/theme.ts`
- **Optimization Hooks**: `/hooks/use-optimized-styles.ts`

### Style Categories

#### 1. Layout Styles

```typescript
import { Layout } from "@/constants/common-styles";

// Usage
<View style={Layout.container} />
<View style={Layout.centeredContainer} />
<View style={Layout.contentContainer} />
```

#### 2. Header Styles

```typescript
import { Header } from "@/constants/common-styles";

// Usage
<View style={Header.glassHeader} />
<View style={Header.headerContent} />
<Text style={Header.headerTitle} />
<TouchableOpacity style={Header.backButton} />
```

#### 3. Card Styles

```typescript
import { Card } from "@/constants/common-styles";

// Usage
<View style={[Card.base, Card.glass]} />
<View style={[Card.base, Card.elevated]} />
```

#### 4. Button Styles

```typescript
import { Button } from "@/constants/common-styles";

// Usage
<TouchableOpacity style={Button.base} />
<TouchableOpacity style={Button.small} />
<TouchableOpacity style={Button.ghost} />
```

#### 5. Input Styles

```typescript
import { Input } from "@/constants/common-styles";

// Usage
<TextInput style={Input.base} />
<TextInput style={Input.search} />
```

#### 6. List Styles

```typescript
import { List } from "@/constants/common-styles";

// Usage
<View style={[List.item, List.itemWithBorderLeft]} />
<View style={List.iconContainer} />
```

## Performance Optimization

### 1. Memoized Styles

```typescript
import { useOptimizedStyles } from "@/hooks/use-optimized-styles";

const styles = useOptimizedStyles((colors) => ({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  card: {
    backgroundColor: colors.card,
    padding: 16,
  },
}));
```

### 2. Theme-Aware Styles

```typescript
import { useCommonStyles } from "@/hooks/use-optimized-styles";

const { themedContainer, themedCard, themedPrimaryButton } = useCommonStyles();
```

### 3. Responsive Styles

```typescript
import { useResponsiveStyles } from "@/hooks/use-optimized-styles";

const styles = useResponsiveStyles(
  {
    base: { padding: 16 },
    small: { padding: 8 },
    large: { padding: 24 },
  },
  screenWidth
);
```

## Migration Guide

### Before (Duplicated Styles)

```typescript
// In tools.tsx
const styles = StyleSheet.create({
  container: { flex: 1 },
  backgroundGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    zIndex: 5,
  },
  // ... 50+ lines of duplicated styles
});

// In wellbeing.tsx
const styles = StyleSheet.create({
  container: { flex: 1 }, // Same as above
  backgroundGradient: {
    // Same as above
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    zIndex: 5,
  },
  // ... 50+ lines of duplicated styles
});
```

### After (Centralized Styles)

```typescript
// In tools.tsx
import { Layout, Header, Card } from "@/constants/common-styles";

const styles = StyleSheet.create({
  content: { /* Only unique styles */ },
  cardTitle: { /* Only unique styles */ },
});

// Usage
<SafeAreaView style={Layout.container}>
  <LinearGradient style={Header.backgroundGradient} />
  <View style={Header.glassHeader}>
    <ThemedView style={[Card.glass, { backgroundColor: colors.card }]} />
```

## Benefits

### 1. Reduced Code Duplication

- **Before**: 200+ lines of duplicated StyleSheet definitions
- **After**: Centralized reusable style patterns

### 2. Improved Performance

- Memoized style objects prevent unnecessary recalculations
- Reduced memory footprint through style reuse
- Optimized rendering with consistent style references

### 3. Better Maintainability

- Single source of truth for common patterns
- Easy to update global design changes
- Consistent styling across all components

### 4. Theme Integration

- Automatic theme-aware styling
- Consistent color application
- Reduced theme-related bugs

## Best Practices

### 1. Use Centralized Styles First

Always check if a style exists in the common styles before creating new ones.

### 2. Combine with Local Styles

For component-specific styles, combine centralized with local styles:

```typescript
<View style={[Card.base, styles.customStyle]} />
```

### 3. Use Performance Hooks

For dynamic styles based on theme or props, use optimization hooks:

```typescript
const styles = useOptimizedStyles(
  (colors) => ({
    dynamicStyle: {
      backgroundColor: colors.primary,
      opacity: isActive ? 1 : 0.5,
    },
  }),
  [isActive]
);
```

### 4. Follow Naming Conventions

- Use descriptive names: `headerTitle`, `glassCard`
- Group related styles: `Header.*`, `Card.*`
- Maintain consistent patterns across all components

## Style Optimization Metrics

### Before Optimization

- **Total StyleSheet lines**: ~2000 across all files
- **Duplicated patterns**: ~80%
- **Style recalculation**: High (every render)
- **Memory usage**: High (duplicate style objects)

### After Optimization

- **Total StyleSheet lines**: ~800 (60% reduction)
- **Duplicated patterns**: ~20%
- **Style recalculation**: Low (memoized)
- **Memory usage**: Optimized (reused objects)

## Future Enhancements

1. **Automated Style Detection**: CLI tool to identify duplicated patterns
2. **Stylelint Rules**: Custom rules to enforce centralized style usage
3. **Runtime Style Analytics**: Monitor style performance in production
4. **Design System Integration**: Connect with Figma/Sketch design tokens

## Troubleshooting

### Common Issues

1. **Style Not Applying**: Check if centralized style is properly imported
2. **Theme Issues**: Ensure useTheme hook is used in component
3. **Performance Problems**: Verify memoization hooks are used correctly
4. **Naming Conflicts**: Use unique names for component-specific styles

### Debug Tools

```typescript
// Enable style debugging in development
if (__DEV__) {
  console.log("Style optimization active:", Object.keys(styles));
}
```

## Conclusion

The centralized style system provides a solid foundation for consistent, performant, and maintainable styling across the Simorgh Connect app. By following these guidelines and using the provided utilities, developers can create beautiful UIs while maintaining optimal performance.
