import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export type ProgressBarProps = {
  value: number; // 0..1
  style?: StyleProp<ViewStyle>;
};

export function ProgressBar({ value, style }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(1, value || 0));
  const theme = useColorScheme() ?? 'light';

  const borderColor = Colors[theme].border;
  const fillColor = Colors[theme].primary;

  return (
    <View style={[styles.container, { borderColor }, style]}>
      <View style={[styles.fill, { width: `${clamped * 100}%`, backgroundColor: fillColor }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 6,
    borderRadius: 999,
    borderWidth: 1,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
});
