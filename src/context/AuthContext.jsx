import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/auth/authService.js';
import { userService } from '../services/user/userService.js';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  // Sync user state on start
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
      } catch (err) {
        console.error("Error parsing user from localStorage", err);
      }
    }

    const unsubscribe = authService.onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const profile = await userService.getUserProfile(firebaseUser.uid);
          const name = profile?.name || "";
          const role = profile?.role || "USER";
          setUserName(name);
          const cleanUser = {
            user: {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName || name || "",
              role: role,
            }
          };
          setUser(cleanUser);
          localStorage.setItem('user', JSON.stringify(cleanUser));
        } catch (err) {
          console.error("Error loading user profile from Firestore", err);
        }
      } else {
        setUser(null);
        setUserName('');
        localStorage.removeItem('user');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const result = await authService.login(email, password);
      const profile = await userService.getUserProfile(result.user.uid);
      const name = profile?.name || "";
      const role = profile?.role || "USER";
      const cleanUser = {
        user: {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName || name || "",
          role: role,
        }
      };
      setUser(cleanUser);
      localStorage.setItem('user', JSON.stringify(cleanUser));
      setUserName(name);
      setIsLoginOpen(false);
      return result;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name, email, password) => {
    setLoading(true);
    try {
      const result = await authService.signup(name, email, password);
      const cleanUser = {
        user: {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName || name || "",
          role: "USER",
        }
      };
      setUser(cleanUser);
      localStorage.setItem('user', JSON.stringify(cleanUser));
      setUserName(name);
      setIsSignupOpen(false);
      return result;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
      setUser(null);
      setUserName('');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, userName, loading, setLoading, 
      login, signup, logout,
      isLoginOpen, setIsLoginOpen,
      isSignupOpen, setIsSignupOpen
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
