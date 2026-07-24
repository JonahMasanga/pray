import React, { createContext, useState, useContext, useEffect } from 'react';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
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
      await auth.signOut();
    } catch (error) {
      console.error('Sign-out failed:', error);
    }
    setUser(null);
    setIsAuthenticated(false);
  };

  const navigateToLogin = () => {
    // No dedicated login page; anonymous auth is used automatically.
  };

  const checkUserAuth = () => {
    // Auth state is managed by the onAuthStateChanged listener above.
  };

  const checkAppState = () => {
    // No external app-settings endpoint needed with Firebase.
  };

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
