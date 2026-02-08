import React, { Component, ReactNode } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useTheme } from "../hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import ErrorHandler from "../utils/error-handler";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: any) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: any;
}

export class ErrorBoundary extends Component<Props, State> {
  private errorHandler = ErrorHandler.getInstance();

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    this.setState({
      error,
      errorInfo,
    });

    this.errorHandler.handleError(error, "React Component");

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorFallback error={this.state.error} onReset={this.handleReset} />
      );
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error: Error | null;
  onReset: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, onReset }) => {
  const { theme } = useTheme();

  const getErrorIcon = () => {
    if (error?.name === "NetworkError") return "wifi-off-outline";
    if (error?.name === "TypeError") return "alert-circle-outline";
    if (error?.name === "ReferenceError") return "bug-outline";
    return "warning-outline";
  };

  const getErrorTitle = () => {
    if (error?.name === "NetworkError") return "Network Error";
    if (error?.name === "TypeError") return "Type Error";
    if (error?.name === "ReferenceError") return "Reference Error";
    return "Something went wrong";
  };

  const getErrorMessage = () => {
    if (__DEV__ && error?.message) {
      return error.message;
    }
    return "An unexpected error occurred. Please try again or contact support if the problem persists.";
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: theme.error + "20" },
            ]}
          >
            <Ionicons
              name={getErrorIcon() as any}
              size={48}
              color={theme.error}
            />
          </View>

          <Text style={[styles.title, { color: theme.text }]}>
            {getErrorTitle()}
          </Text>

          <Text style={[styles.message, { color: theme.textSecondary }]}>
            {getErrorMessage()}
          </Text>

          {__DEV__ && error?.stack && (
            <View
              style={[
                styles.debugContainer,
                {
                  backgroundColor: theme.cardBackground,
                  borderColor: theme.border,
                },
              ]}
            >
              <Text style={[styles.debugTitle, { color: theme.text }]}>
                Debug Information
              </Text>
              <ScrollView style={styles.debugScroll}>
                <Text
                  style={[styles.debugText, { color: theme.textSecondary }]}
                >
                  {error.stack}
                </Text>
              </ScrollView>
            </View>
          )}

          <View style={styles.actions}>
            <TouchableOpacity
              style={[
                styles.button,
                styles.primaryButton,
                { backgroundColor: theme.accent },
              ]}
              onPress={onReset}
            >
              <Ionicons
                name="refresh-outline"
                size={20}
                color="#FFFFFF"
                style={styles.buttonIcon}
              />
              <Text style={styles.buttonText}>Try Again</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                styles.secondaryButton,
                {
                  backgroundColor: theme.cardBackground,
                  borderColor: theme.border,
                },
              ]}
              onPress={() => {
                // Clear recent errors and restart
                ErrorHandler.getInstance().clearErrors();
                onReset();
              }}
            >
              <Ionicons
                name="home-outline"
                size={20}
                color={theme.text}
                style={styles.buttonIcon}
              />
              <Text style={[styles.secondaryButtonText, { color: theme.text }]}>
                Go Home
              </Text>
            </TouchableOpacity>
          </View>

          {!__DEV__ && (
            <View
              style={[
                styles.supportContainer,
                {
                  backgroundColor: theme.cardBackground,
                  borderColor: theme.border,
                },
              ]}
            >
              <Text style={[styles.supportTitle, { color: theme.text }]}>
                Need Help?
              </Text>
              <Text
                style={[styles.supportText, { color: theme.textSecondary }]}
              >
                If this problem continues, please contact our support team for
                assistance.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    fontWeight: "400",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
  },
  debugContainer: {
    width: "100%",
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 24,
  },
  debugTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  debugScroll: {
    maxHeight: 200,
  },
  debugText: {
    fontSize: 12,
    fontFamily: "monospace",
    lineHeight: 18,
  },
  actions: {
    width: "100%",
    gap: 12,
    marginBottom: 24,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  primaryButton: {
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  secondaryButton: {
    borderWidth: 1,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  supportContainer: {
    width: "100%",
    borderRadius: 12,
    borderWidth: 1,
    padding: 20,
    alignItems: "center",
  },
  supportTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  supportText: {
    fontSize: 14,
    fontWeight: "400",
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 20,
  },
  supportButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  supportButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
});

export default ErrorBoundary;
