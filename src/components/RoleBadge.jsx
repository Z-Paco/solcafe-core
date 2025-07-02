"use client";

import React from "react";

const roleColors = {
  Techie: {
    background: "var(--techie-bg, #2a9d8f)",
    text: "var(--techie-text, #f0f8ff)",
  },
  Storyteller: {
    background: "var(--storyteller-bg, #e9c46a)",
    text: "var(--storyteller-text, #333333)",
  },
  Engineer: {
    background: "var(--engineer-bg, #0077b6)",
    text: "var(--engineer-text, #ffffff)",
  },
  Community: {
    background: "var(--community-bg, #b5838d)",
    text: "var(--community-text, #ffffff)",
  },
  Artist: {
    background: "var(--artist-bg, #e76f51)",
    text: "var(--artist-text, #ffffff)",
  },
};

export default function RoleBadge({ role, level, size = "medium" }) {
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
      {level && <span className="role-level">Lvl {level}</span>}
    </div>
  );
}
