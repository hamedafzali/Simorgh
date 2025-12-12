declare module "expo-image" {
  import * as React from "react";

  export interface ImageProps {
    source?: any;
    style?: any;
    [key: string]: any;
  }

  export const Image: React.FC<ImageProps>;
}

declare module "react-native" {
  import * as React from "react";

  export interface ViewProps {
    children?: React.ReactNode;
    style?: any;
    [key: string]: any;
  }

  export const View: React.FC<ViewProps>;

  export interface TextProps {
    children?: React.ReactNode;
    style?: any;
    [key: string]: any;
  }

  export const Text: React.FC<TextProps>;

  export interface ImageProps {
    source?: any;
    style?: any;
    [key: string]: any;
  }

  declare const Image: React.FC<ImageProps>;
  export { Image };

  export interface TouchableOpacityProps {
    children?: React.ReactNode;
    style?: any;
    onPress?: () => void;
    [key: string]: any;
  }

  export const TouchableOpacity: React.FC<TouchableOpacityProps>;

  export interface ScrollViewProps {
    children?: React.ReactNode;
    style?: any;
    contentContainerStyle?: any;
    [key: string]: any;
  }

  export const ScrollView: React.FC<ScrollViewProps> & {
    scrollToEnd?: (options?: { animated?: boolean }) => void;
    scrollTo?: (options?: {
      x?: number;
      y?: number;
      animated?: boolean;
    }) => void;
  };

  export interface ActivityIndicatorProps {
    size?: "small" | "large";
    color?: string;
    [key: string]: any;
  }

  export const ActivityIndicator: React.FC<ActivityIndicatorProps>;

  export interface TextInputProps {
    value?: string;
    onChangeText?: (text: string) => void;
    placeholder?: string;
    style?: any;
    [key: string]: any;
  }

  export const TextInput: React.FC<TextInputProps>;

  export interface StatusBarProps {
    barStyle?: "default" | "light-content" | "dark-content";
    hidden?: boolean;
    [key: string]: any;
  }

  export const StatusBar: React.FC<StatusBarProps>;

  export const StyleSheet: {
    create: (styles: any) => any;
    flatten: (style: any) => any;
    absoluteFill: any;
    absoluteFillObject: any;
  };

  export const Animated: {
    View: React.FC<ViewProps>;
    Text: React.FC<TextProps>;
    Image: React.FC<ImageProps>;
    ScrollView: React.FC<ScrollViewProps>;
    timing: (value: any, config: any) => any;
    spring: (value: any, config: any) => any;
    sequence: (animations: any[]) => any;
    parallel: (animations: any[]) => any;
    loop: (animation: any) => any;
    Value: any;
    ValueXY: any;
  };

  export type WrapperRef = any;
  export type AnimatedRef<T> = any;

  export const useAnimatedRef: <T>() => AnimatedRef<T>;
  export const useScrollOffset: (ref: AnimatedRef<any>) => any;
  export const useAnimatedStyle: (styleFn: () => any) => any;

  export type StyleProp<T> = T;
  export type ViewStyle = any;
  export type TextStyle = any;
  export type ImageStyle = any;

  export type ImageSourcePropType = any;
  export type OpaqueColorValue = any;

  export type AccessibilityRole = any;
  export type AccessibilityState = any;

  export interface PressableProps {
    children?: React.ReactNode;
    style?: any;
    onPress?: () => void;
    [key: string]: any;
  }

  export const Pressable: React.FC<PressableProps>;

  export interface FlatListProps<T> {
    data?: T[];
    renderItem?: (info: { item: T; index: number }) => React.ReactNode;
    keyExtractor?: (item: T, index: number) => string;
    refreshControl?: any;
    [key: string]: any;
  }

  export const FlatList: <T>(props: FlatListProps<T>) => React.ReactNode;

  export interface RefreshControlProps {
    refreshing?: boolean;
    onRefresh?: () => void;
    [key: string]: any;
  }

  export const RefreshControl: React.FC<RefreshControlProps>;

  export interface SwitchProps {
    value?: boolean;
    onValueChange?: (value: boolean) => void;
    [key: string]: any;
  }

  export const Switch: React.FC<SwitchProps>;

  export interface KeyboardAvoidingViewProps {
    children?: React.ReactNode;
    behavior?: "padding" | "height" | "position";
    [key: string]: any;
  }

  export const KeyboardAvoidingView: React.FC<KeyboardAvoidingViewProps>;

  export const Alert: {
    alert: (title: string, message?: string, buttons?: any) => void;
  };

  export const Linking: {
    openURL: (url: string) => Promise<void>;
    canOpenURL: (url: string) => Promise<boolean>;
  };

  export const Platform: {
    OS: "ios" | "android" | "web";
    select: (specifics: any) => any;
  };

  export const useColorScheme: () => "light" | "dark";

  export const Dimensions: {
    get: (dimension: "window" | "screen") => { width: number; height: number };
  };
}
