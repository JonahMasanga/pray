import React, { createContext, useState, useContext, useEffect } from 'react';
import { onAuthStateChanged, signInAnonymously, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [appPublicSettings] = useState(null);

  useEffect(() => {
    // Sign in anonymously so the app always has a Firebase user context,
    // then subscribe to auth state changes.
    signInAnonymously(auth).catch((error) => {
      console.error('Anonymous sign-in failed:', error);
      setAuthError({ type: 'auth_error', message: error.message });
      setIsLoadingAuth(false);
      setAuthChecked(true);
    });

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({ uid: firebaseUser.uid, isAnonymous: firebaseUser.isAnonymous });
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setIsLoadingAuth(false);
      setAuthChecked(true);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Sign-out failed:', error);
    }
  };

  // navigateToLogin, checkUserAuth, and checkAppState are kept as no-ops to satisfy
  // the AuthContext contract used by consumer components (e.g. App.jsx). With Firebase
  // Anonymous Auth the app never needs a manual login redirect or explicit auth checks.
  const navigateToLogin = () => {};
  const checkUserAuth = () => {};
  const checkAppState = () => {};

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoadingAuth,
      isLoadingPublicSettings,
      authError,
      appPublicSettings,
      authChecked,
      logout,
      navigateToLogin,
      checkUserAuth,
      checkAppState
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
