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

export default function RegisterScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { register, isLoading } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    germanLevel: "A1",
    location: "",
    nativeLanguage: "Farsi",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    location: "",
  });

  const germanLevels = ["A1", "A2", "B1", "B2", "C1", "C2"];
  const nativeLanguages = ["Farsi", "Arabic", "Turkish", "English", "Other"];

  const validateForm = () => {
    const newErrors = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      location: "",
    };

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    const result = await register(formData);

    if (!result.success) {
      Alert.alert(
        "Registration Failed",
        result.error || "An error occurred during registration"
      );
    }
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
            Create Account
          </Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Join the Iranian community learning German
          </Text>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          {/* Name Input */}
          <View style={styles.inputContainer}>
            <View
              style={[
                styles.inputWrapper,
                { borderColor: errors.name ? theme.error : theme.border },
              ]}
            >
              <Ionicons
                name="person-outline"
                size={20}
                color={errors.name ? theme.error : theme.textSecondary}
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder="Full name"
                placeholderTextColor={theme.textSecondary}
                value={formData.name}
                onChangeText={(text) => {
                  setFormData((prev) => ({ ...prev, name: text }));
                  if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
                }}
                autoCapitalize="words"
              />
            </View>
            {errors.name && (
              <Text style={[styles.errorText, { color: theme.error }]}>
                {errors.name}
              </Text>
            )}
          </View>

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

          {/* Confirm Password Input */}
          <View style={styles.inputContainer}>
            <View
              style={[
                styles.inputWrapper,
                {
                  borderColor: errors.confirmPassword
                    ? theme.error
                    : theme.border,
                },
              ]}
            >
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={
                  errors.confirmPassword ? theme.error : theme.textSecondary
                }
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, { color: theme.text, flex: 1 }]}
                placeholder="Confirm password"
                placeholderTextColor={theme.textSecondary}
                value={formData.confirmPassword}
                onChangeText={(text) => {
                  setFormData((prev) => ({ ...prev, confirmPassword: text }));
                  if (errors.confirmPassword)
                    setErrors((prev) => ({ ...prev, confirmPassword: "" }));
                }}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Ionicons
                  name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color={theme.textSecondary}
                />
              </TouchableOpacity>
            </View>
            {errors.confirmPassword && (
              <Text style={[styles.errorText, { color: theme.error }]}>
                {errors.confirmPassword}
              </Text>
            )}
          </View>

          {/* German Level */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.text }]}>
              German Level
            </Text>
            <View style={styles.optionsContainer}>
              {germanLevels.map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.optionButton,
                    {
                      backgroundColor:
                        formData.germanLevel === level
                          ? theme.accent
                          : theme.cardBackground,
                      borderColor: theme.border,
                    },
                  ]}
                  onPress={() =>
                    setFormData((prev) => ({ ...prev, germanLevel: level }))
                  }
                >
                  <Text
                    style={[
                      styles.optionText,
                      {
                        color:
                          formData.germanLevel === level
                            ? "#FFFFFF"
                            : theme.text,
                      },
                    ]}
                  >
                    {level}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Native Language */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.text }]}>
              Native Language
            </Text>
            <View style={styles.optionsContainer}>
              {nativeLanguages.map((language) => (
                <TouchableOpacity
                  key={language}
                  style={[
                    styles.optionButton,
                    {
                      backgroundColor:
                        formData.nativeLanguage === language
                          ? theme.accent
                          : theme.cardBackground,
                      borderColor: theme.border,
                    },
                  ]}
                  onPress={() =>
                    setFormData((prev) => ({
                      ...prev,
                      nativeLanguage: language,
                    }))
                  }
                >
                  <Text
                    style={[
                      styles.optionText,
                      {
                        color:
                          formData.nativeLanguage === language
                            ? "#FFFFFF"
                            : theme.text,
                      },
                    ]}
                  >
                    {language}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Location Input */}
          <View style={styles.inputContainer}>
            <View
              style={[
                styles.inputWrapper,
                { borderColor: errors.location ? theme.error : theme.border },
              ]}
            >
              <Ionicons
                name="location-outline"
                size={20}
                color={errors.location ? theme.error : theme.textSecondary}
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder="City, Germany"
                placeholderTextColor={theme.textSecondary}
                value={formData.location}
                onChangeText={(text) => {
                  setFormData((prev) => ({ ...prev, location: text }));
                  if (errors.location)
                    setErrors((prev) => ({ ...prev, location: "" }));
                }}
              />
            </View>
            {errors.location && (
              <Text style={[styles.errorText, { color: theme.error }]}>
                {errors.location}
              </Text>
            )}
          </View>

          {/* Register Button */}
          <TouchableOpacity
            style={[styles.registerButton, { backgroundColor: theme.accent }]}
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <Text style={styles.registerButtonText}>Creating account...</Text>
            ) : (
              <Text style={styles.registerButtonText}>Create Account</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Sign In Link */}
        <View style={styles.signInContainer}>
          <Text style={[styles.signInText, { color: theme.textSecondary }]}>
            Already have an account?{" "}
          </Text>
          <TouchableOpacity onPress={() => router.push("/auth/login")}>
            <Text style={[styles.signInLink, { color: theme.accent }]}>
              Sign in
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
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
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
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  optionText: {
    fontSize: 14,
    fontWeight: "500",
  },
  registerButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 20,
  },
  registerButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  signInContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  signInText: {
    fontSize: 14,
    fontWeight: "400",
  },
  signInLink: {
    fontSize: 14,
    fontWeight: "600",
  },
});
