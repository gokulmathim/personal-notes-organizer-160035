import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getProfile, login as apiLogin, signup as apiSignup } from "../services/api";

const AuthContext = createContext(null);

// PUBLIC_INTERFACE
export function useAuth() {
  /** Hook to access authentication state and actions. */
  return useContext(AuthContext);
}

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  /** Provides authentication state (user, token) and actions (login, signup, logout) to the app. */
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);

  // Restore session
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("notes_token");
      const storedUser = localStorage.getItem("notes_user");
      if (storedToken) {
        setToken(storedToken);
      }
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch {
      // ignore
    }
    setLoading(false);
  }, []);

  // Keep localStorage in sync
  useEffect(() => {
    try {
      if (token) localStorage.setItem("notes_token", token);
      else localStorage.removeItem("notes_token");
    } catch {
      // ignore
    }
  }, [token]);

  useEffect(() => {
    try {
      if (user) localStorage.setItem("notes_user", JSON.stringify(user));
      else localStorage.removeItem("notes_user");
    } catch {
      // ignore
    }
  }, [user]);

  // PUBLIC_INTERFACE
  const login = async (email, password) => {
    /** Logs in with email/password. Sets user and token. */
    const data = await apiLogin(email, password);
    if (data?.token) setToken(data.token);
    if (data?.user) setUser(data.user);
    // If token present but user missing, try to fetch profile
    if (data?.token && !data?.user) {
      try {
        const me = await getProfile();
        setUser(me);
      } catch {
        // ignore
      }
    }
    return data;
  };

  // PUBLIC_INTERFACE
  const signup = async (name, email, password) => {
    /** Signs up a new user. Sets user and token. */
    const data = await apiSignup(name, email, password);
    if (data?.token) setToken(data.token);
    if (data?.user) setUser(data.user);
    if (data?.token && !data?.user) {
      try {
        const me = await getProfile();
        setUser(me);
      } catch {
        // ignore
      }
    }
    return data;
  };

  // PUBLIC_INTERFACE
  const logout = () => {
    /** Clears authentication state and local storage. */
    setUser(null);
    setToken("");
    try {
      localStorage.removeItem("notes_token");
      localStorage.removeItem("notes_user");
    } catch {
      // ignore
    }
  };

  const value = useMemo(() => ({ user, token, loading, login, signup, logout }), [user, token, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
