import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../hooks/use-theme";
import { useAuth } from "../../hooks/use-auth";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { login, isLoading } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const validateForm = () => {
    const newErrors = {
      email: "",
      password: "",
    };

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    const result = await login(formData.email, formData.password);

    if (!result.success) {
      Alert.alert(
        "Login Failed",
        result.error || "An error occurred during login"
      );
    }
  };

  const handleForgotPassword = () => {
    Alert.alert(
      "Forgot Password",
      "Password reset functionality will be implemented soon."
    );
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.background, paddingTop: insets.top },
      ]}
    >
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View
            style={[styles.logoContainer, { backgroundColor: theme.accent }]}
          >
            <Text style={styles.logoText}>سیمرغ</Text>
          </View>
          <Text style={[styles.title, { color: theme.text }]}>
            Welcome Back
          </Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Sign in to continue learning German
          </Text>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          {/* Email Input */}
          <View style={styles.inputContainer}>
            <View
              style={[
                styles.inputWrapper,
                { borderColor: errors.email ? theme.error : theme.border },
              ]}
            >
              <Ionicons
                name="mail-outline"
                size={20}
                color={errors.email ? theme.error : theme.textSecondary}
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder="Email address"
                placeholderTextColor={theme.textSecondary}
                value={formData.email}
                onChangeText={(text) => {
                  setFormData((prev) => ({ ...prev, email: text }));
                  if (errors.email)
                    setErrors((prev) => ({ ...prev, email: "" }));
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            {errors.email && (
              <Text style={[styles.errorText, { color: theme.error }]}>
                {errors.email}
              </Text>
            )}
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <View
              style={[
                styles.inputWrapper,
                { borderColor: errors.password ? theme.error : theme.border },
              ]}
            >
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={errors.password ? theme.error : theme.textSecondary}
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, { color: theme.text, flex: 1 }]}
                placeholder="Password"
                placeholderTextColor={theme.textSecondary}
                value={formData.password}
                onChangeText={(text) => {
                  setFormData((prev) => ({ ...prev, password: text }));
                  if (errors.password)
                    setErrors((prev) => ({ ...prev, password: "" }));
                }}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color={theme.textSecondary}
                />
              </TouchableOpacity>
            </View>
            {errors.password && (
              <Text style={[styles.errorText, { color: theme.error }]}>
                {errors.password}
              </Text>
            )}
          </View>

          {/* Forgot Password */}
          <TouchableOpacity
            style={styles.forgotPasswordContainer}
            onPress={handleForgotPassword}
          >
            <Text style={[styles.forgotPasswordText, { color: theme.accent }]}>
              Forgot password?
            </Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.loginButton, { backgroundColor: theme.accent }]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <Text style={styles.loginButtonText}>Signing in...</Text>
            ) : (
              <Text style={styles.loginButtonText}>Sign In</Text>
            )}
          </TouchableOpacity>

          {/* Demo Account Info */}
          <View
            style={[
              styles.demoContainer,
              {
                backgroundColor: theme.cardBackground,
                borderColor: theme.border,
              },
            ]}
          >
            <Text style={[styles.demoTitle, { color: theme.text }]}>
              Demo Account
            </Text>
            <Text style={[styles.demoText, { color: theme.textSecondary }]}>
              Email: sara@example.com
            </Text>
            <Text style={[styles.demoText, { color: theme.textSecondary }]}>
              Password: password123
            </Text>
          </View>
        </View>

        {/* Sign Up Link */}
        <View style={styles.signUpContainer}>
          <Text style={[styles.signUpText, { color: theme.textSecondary }]}>
            Don't have an account?{" "}
          </Text>
          <TouchableOpacity onPress={() => router.push("/auth/register")}>
            <Text style={[styles.signUpLink, { color: theme.accent }]}>
              Sign up
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    alignItems: "center",
    paddingVertical: 40,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  logoText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "700",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "400",
    textAlign: "center",
  },
  formContainer: {
    paddingVertical: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    fontSize: 16,
    fontWeight: "400",
  },
  eyeIcon: {
    marginLeft: 12,
    padding: 4,
  },
  errorText: {
    fontSize: 12,
    fontWeight: "400",
    marginTop: 4,
  },
  forgotPasswordContainer: {
    alignItems: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: "500",
  },
  loginButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 20,
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  demoContainer: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    alignItems: "center",
  },
  demoTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  demoText: {
    fontSize: 12,
    fontWeight: "400",
    marginBottom: 2,
  },
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  signUpText: {
    fontSize: 14,
    fontWeight: "400",
  },
  signUpLink: {
    fontSize: 14,
    fontWeight: "600",
  },
});
