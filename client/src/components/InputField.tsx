import React from "react";

interface FieldProps {
    label: string;
    name: string;
    placeholder?: string;
    type: string;
    value: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
}

export const InputField: React.FC<FieldProps> = ({ label, name, type, value, error, onChange }) => {
  return (
    <div style={{ marginBottom: "12px" }}>
      {label && <label style={{ display: "block", marginBottom: "4px" }}>{label}</label>}

      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={label}
        style={{
          padding: "8px 12px",
          width: "100%",
          borderRadius: "6px",
          border: error ? "1px solid #ff4d4f" : "1px solid #ccc",
        }}
      />

      {error && (
        <p style={{ color: "red", marginTop: "4px", fontSize: "13px" }}>
          {error}
        </p>
      )}
    </div>
  );
};