import React from "react";

const roleColors = {
  Dreamer: {
    background: "var(--dreamer-bg, #e9c46a)",
    text: "var(--dreamer-text, #333333)",
  },
  Techie: {
    background: "var(--techie-bg, #2a9d8f)",
    text: "var(--techie-text, #f0f8ff)",
  },
  "Book Keeper": {
    background: "var(--bookkeeper-bg, #0077b6)",
    text: "var(--bookkeeper-text, #ffffff)",
  },
};

export default function RoleBadge({ role, size = "medium" }) {
  const roleStyle = roleColors[role] || { background: "#888", text: "#fff" };

  const sizeClasses = {
    small: "role-badge-small",
    medium: "",
    large: "role-badge-large",
  };

  return (
    <div
      className={`role-badge ${sizeClasses[size] || ""}`}
      style={{
        backgroundColor: roleStyle.background,
        color: roleStyle.text,
      }}
    >
      <span className="role-name">{role}</span>
    </div>
  );
}
