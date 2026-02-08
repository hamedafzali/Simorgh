import { useState } from "react";
import { Validator, ValidationResult } from "../utils/validation";
import { ValidationError } from "../utils/error-handler";
import { ErrorHandler } from "../utils/error-handler";

export interface FieldValidation {
  value: string;
  rules: any;
  error?: string;
  touched: boolean;
}

export interface UseValidationReturn {
  fields: Record<string, FieldValidation>;
  errors: ValidationError[];
  isValid: boolean;
  isDirty: boolean;
  validateField: (fieldName: string, value: string) => boolean;
  validateAll: () => boolean;
  setFieldValue: (fieldName: string, value: string) => void;
  setFieldTouched: (fieldName: string, touched: boolean) => void;
  resetForm: () => void;
  clearErrors: () => void;
}

export const useValidation = (
  initialFields: Record<string, { value: string; rules: any }>
) => {
  const [fields, setFields] = useState<Record<string, FieldValidation>>(
    Object.entries(initialFields).reduce(
      (acc, [name, { value, rules }]) => ({
        ...acc,
        [name]: {
          value,
          rules,
          error: undefined,
          touched: false,
        },
      }),
      {}
    )
  );

  const errorHandler = ErrorHandler.getInstance();

  const validateField = (fieldName: string, value: string): boolean => {
    const field = fields[fieldName];
    if (!field) return false;

    const result = Validator.validate(value, fieldName, field.rules);

    setFields((prev) => ({
      ...prev,
      [fieldName]: {
        ...prev[fieldName],
        value,
        error: result.isValid ? undefined : result.errors[0]?.message,
      },
    }));

    return result.isValid;
  };

  const validateAll = (): boolean => {
    let allValid = true;
    const updatedFields = { ...fields };

    Object.entries(updatedFields).forEach(([fieldName, field]) => {
      const result = Validator.validate(field.value, fieldName, field.rules);

      if (!result.isValid) {
        allValid = false;
        updatedFields[fieldName] = {
          ...field,
          error: result.errors[0]?.message,
        };
      }
    });

    setFields(updatedFields);
    return allValid;
  };

  const setFieldValue = (fieldName: string, value: string) => {
    setFields((prev) => ({
      ...prev,
      [fieldName]: {
        ...prev[fieldName],
        value,
        error: undefined,
      },
    }));
  };

  const setFieldTouched = (fieldName: string, touched: boolean) => {
    setFields((prev) => ({
      ...prev,
      [fieldName]: {
        ...prev[fieldName],
        touched,
      },
    }));

    // Validate field when touched
    if (touched) {
      validateField(fieldName, fields[fieldName]?.value || "");
    }
  };

  const resetForm = () => {
    setFields(
      Object.entries(initialFields).reduce(
        (acc, [name, { value, rules }]) => ({
          ...acc,
          [name]: {
            value,
            rules,
            error: undefined,
            touched: false,
          },
        }),
        {}
      )
    );
  };

  const clearErrors = () => {
    setFields((prev) => {
      const cleared = { ...prev };
      Object.keys(cleared).forEach((key) => {
        cleared[key] = {
          ...cleared[key],
          error: undefined,
        };
      });
      return cleared;
    });
  };

  const errors = Object.entries(fields)
    .filter(([_, field]) => field.error)
    .map(([fieldName, field]) => ({
      field: fieldName,
      message: field.error || "",
      code: "VALIDATION_ERROR",
    }));

  const isValid = Object.values(fields).every((field) => !field.error);
  const isDirty = Object.values(fields).some((field) => field.touched);

  return {
    fields,
    errors,
    isValid,
    isDirty,
    validateField,
    validateAll,
    setFieldValue,
    setFieldTouched,
    resetForm,
    clearErrors,
  };
};

export const useLoginValidation = () => {
  return useValidation({
    email: { value: "", rules: { required: true, email: true } },
    password: { value: "", rules: { required: true, minLength: 6 } },
  });
};

export const useRegisterValidation = () => {
  return useValidation({
    name: { value: "", rules: { required: true, minLength: 2, maxLength: 50 } },
    email: { value: "", rules: { required: true, email: true } },
    password: { value: "", rules: { required: true, password: true } },
    confirmPassword: { value: "", rules: { required: true } },
    germanLevel: { value: "A1", rules: { required: true } },
    location: { value: "", rules: { required: true, minLength: 3 } },
    nativeLanguage: { value: "Farsi", rules: { required: true } },
  });
};

export const useMessageValidation = () => {
  return useValidation({
    message: {
      value: "",
      rules: { required: true, minLength: 1, maxLength: 1000 },
    },
  });
};

export const useJobValidation = () => {
  return useValidation({
    title: {
      value: "",
      rules: { required: true, minLength: 5, maxLength: 100 },
    },
    description: {
      value: "",
      rules: { required: true, minLength: 20, maxLength: 2000 },
    },
    company: {
      value: "",
      rules: { required: true, minLength: 2, maxLength: 100 },
    },
    location: {
      value: "",
      rules: { required: true, minLength: 3, maxLength: 100 },
    },
    type: { value: "", rules: { required: true } },
    category: { value: "", rules: { required: true } },
  });
};

export const useEventValidation = () => {
  return useValidation({
    title: {
      value: "",
      rules: { required: true, minLength: 5, maxLength: 100 },
    },
    description: {
      value: "",
      rules: { required: true, minLength: 20, maxLength: 1000 },
    },
    date: { value: "", rules: { required: true } },
    location: {
      value: "",
      rules: { required: true, minLength: 3, maxLength: 100 },
    },
    category: { value: "", rules: { required: true } },
  });
};

export const validateConfirmPassword = (
  password: string,
  confirmPassword: string
): boolean => {
  if (password !== confirmPassword) {
    const errorHandler = ErrorHandler.getInstance();
    errorHandler.handleValidationError([
      {
        field: "confirmPassword",
        message: "Passwords do not match",
        code: "PASSWORD_MISMATCH",
      },
    ]);
    return false;
  }
  return true;
};

export default useValidation;
