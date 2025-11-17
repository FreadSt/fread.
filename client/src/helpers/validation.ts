interface ValidationData {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export const validation = (data: ValidationData): Partial<ValidationData> => {
  const errors: Partial<ValidationData> = {};

  if (!data.name) {
    errors.name = "Username";
  } else if (data.name.length < 2) {
    errors.name = "At least 2 characters";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email) {
    errors.email = "Email";
  } else if (!emailRegex.test(data.email)) {
    errors.email = "Enter correct email";
  }

  if (!data.password) {
    errors.password = "Password";
  } else if (data.password.length < 6) {
    errors.password = "At least 6 characters";
  }

  if (!data.confirmPassword) {
    errors.confirmPassword = "Password confirm";
  } else if (data.password !== data.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
};