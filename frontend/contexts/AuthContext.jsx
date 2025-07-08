"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect, createContext, useContext } from "react";
import { setCookie, deleteCookie, getCookie } from "cookies-next";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : {}
  );
  const [token, setToken] = useState(
    typeof window !== "undefined" ? getCookie("authToken") || "" : null
  );
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const router = useRouter();

  const login = async (username, password) => {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      const { token, user } = await res.json();
      setCookie("authToken", token, {
        maxAge: 30 * 24 * 60 * 60,
      });
      setUser(user);
      setToken(token);
      localStorage.setItem("user", JSON.stringify(user));

      router.push("/");
    }
  };
  if (typeof window !== "undefined") {
    useEffect(() => {
      if (token) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    }, [token]);
  }

  const logout = () => {
    deleteCookie("authToken");
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
