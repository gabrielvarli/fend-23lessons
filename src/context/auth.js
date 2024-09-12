"use client";

import React, { createContext, useState, useEffect } from "react";
import LocalStorageKit from "@/utils/localStorageKit";
// import useAuth from "@/hooks/useAuth";

// Standardvärden för autentiseringskontexten
const defaultValue = {
  user: {
    id: "",
    email: "",
    name: "",
    createdAt: "",
    updatedAt: "",
  },
  token: "",
  isLoggedIn: false,
  actions: {
    login: (email, password) => {},
    register: (email, password, name) => {},
    logout: () => {},
  },
};

// Skapa kontext för autentisering
const AuthContext = createContext(defaultValue);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(defaultValue.user);
  const [token, setToken] = useState(defaultValue.token);
  const [isLoggedIn, setIsLoggedIn] = useState(defaultValue.isLoggedIn);

  // Kontrollera om det finns ett token i localStorage
  useEffect(() => {
    const savedToken = LocalStorageKit.getToken();
    if (savedToken) {
      setToken(savedToken);
      setIsLoggedIn(true);
      _getUser(savedToken); // Hämta användardetaljer direkt om token finns
    }
  }, []);

  // Hämta användardetaljer från servern baserat på token
  const _getUser = async (token) => {
    try {
      const res = await fetch("http://localhost:3000/api/auth/me", {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to get user");
      }

      const data = await res.json();
      setUser(data.user);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  // Inloggningsfunktion
  const login = async (email, password) => {
    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        throw new Error("Failed to login");
      }

      const data = await res.json();
      setToken(data.token);
      setUser(data.user);
      LocalStorageKit.setToken(data.token);
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  // Registreringsfunktion
  const register = async (email, password, name) => {
    try {
      const res = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, name }),
      });

      if (!res.ok) {
        throw new Error("Failed to register");
      }

      const data = await res.json();
      setToken(data.token);
      setUser(data.user);
      LocalStorageKit.setToken(data.token);
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  // Utloggningsfunktion
  const logout = () => {
    setIsLoggedIn(false);
    setUser(defaultValue.user);
    setToken(defaultValue.token);
    LocalStorageKit.removeToken();
  };

  // Tillhandahålla autentiseringskontexten till barnkomponenterna
  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoggedIn,
        actions: {
          login,
          register,
          logout,
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Anpassad hook för att använda autentiseringskontexten
const useAuth = () => {
  return React.useContext(AuthContext);
};

export { AuthProvider, useAuth };
