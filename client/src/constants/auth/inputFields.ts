type InputType = "text" | "email" | "password";

interface InputFieldsTypes {
  name: string;
  label: string;
  type: InputType;
}

export const fields = [
  { name: "name", label: "Name", type: "text" },
  { name: "email", label: "Email", type: "email" },
  { name: "password", label: "Password", type: "password" },
  { name: "confirmPassword", label: "Confirm Password", type: "password" },
] as const satisfies InputFieldsTypes[];
