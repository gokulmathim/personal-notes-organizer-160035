import React from "react";
import { useAuth } from "../context/AuthContext";

export default function Header({ onSearch, onNewNote }) {
  const { user, logout } = useAuth();

  return (
    <header className="app-header">
      <div className="brand">
        <span className="brand-accent">✦</span> Notes
      </div>
      <div className="search-box">
        <input
          type="search"
          placeholder="Search notes..."
          onChange={(e) => onSearch?.(e.target.value)}
          aria-label="Search notes"
        />
      </div>
      <div className="header-actions">
        <button className="btn primary" onClick={onNewNote} aria-label="Create new note">
          + New Note
        </button>
        <div className="user-chip" title={user?.email || "Account"}>
          <span className="avatar">{(user?.name || user?.email || "U").slice(0, 1).toUpperCase()}</span>
          <span className="username">{user?.name || user?.email || "User"}</span>
          <button className="btn subtle" onClick={logout} aria-label="Sign out">
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
