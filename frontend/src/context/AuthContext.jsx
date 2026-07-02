import React, { createContext, useState, useEffect } from 'react';
import api from '../utils/api';
import { 
  auth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail, 
  firebaseUpdatePassword 
} from '../utils/firebase';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if Firebase is using placeholder credentials
  const isFirebaseFake = !import.meta.env.VITE_FIREBASE_API_KEY || 
                         import.meta.env.VITE_FIREBASE_API_KEY.includes('Placeholder') ||
                         import.meta.env.VITE_FIREBASE_API_KEY === 'placeholder-api-key';

  useEffect(() => {
    // Restore session from localStorage on load
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      if (isFirebaseFake) {
        console.warn('Firebase placeholder detected. Authenticating via local MySQL fallback...');
        const response = await api.post('/auth/login', { email, password });
        const { token: userToken, user: userData } = response.data;

        localStorage.setItem('token', userToken);
        localStorage.setItem('user', JSON.stringify(userData));

        setToken(userToken);
        setUser(userData);
        return { success: true };
      }

      // 1. Authenticate with Firebase Auth
      const firebaseUserCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = firebaseUserCredential.user;

      // 2. Sync with local MySQL backend
      const response = await api.post('/auth/firebase-login', { email: firebaseUser.email });
      const { token: userToken, user: userData } = response.data;

      localStorage.setItem('token', userToken);
      localStorage.setItem('user', JSON.stringify(userData));

      setToken(userToken);
      setUser(userData);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      
      // If Firebase failed due to config issues, try fallback as safety
      if (!isFirebaseFake && (error.code === 'auth/invalid-api-key' || error.code === 'auth/network-request-failed')) {
        console.warn('Firebase Auth service failed. Trying local MySQL fallback...');
        try {
          const response = await api.post('/auth/login', { email, password });
          const { token: userToken, user: userData } = response.data;
          localStorage.setItem('token', userToken);
          localStorage.setItem('user', JSON.stringify(userData));
          setToken(userToken);
          setUser(userData);
          return { success: true };
        } catch (fallbackErr) {
          return { success: false, error: fallbackErr.response?.data?.message || 'Login failed.' };
        }
      }

      let errMsg = 'Login failed. Please check your credentials.';
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errMsg = 'Invalid email or password.';
      } else if (error.response?.data?.message) {
        errMsg = error.response.data.message;
      }
      return { success: false, error: errMsg };
    }
  };

  const registerUser = async (name, email, address, password, role) => {
    try {
      const finalRole = role || 'Normal User';
      const finalAddress = address || '';

      if (isFirebaseFake) {
        console.warn('Firebase placeholder detected. Registering via local MySQL fallback...');
        await api.post('/auth/register', { 
          name, 
          email, 
          address: finalAddress, 
          password, 
          role: finalRole 
        });
        return { success: true };
      }

      // 1. Check if email is already registered on our local DB
      try {
        await api.post('/auth/firebase-login', { email });
        return { success: false, error: 'Email is already registered in our system.' };
      } catch (dbErr) {
        if (dbErr.response && dbErr.response.status !== 404) {
          return { success: false, error: dbErr.response.data?.message || 'Database validation failed.' };
        }
      }

      // 2. Create user in Firebase Auth
      await createUserWithEmailAndPassword(auth, email, password);

      // 3. Register user details and role in MySQL database
      await api.post('/auth/register', { 
        name, 
        email, 
        address: finalAddress, 
        password,
        role: finalRole 
      });

      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);

      // If Firebase failed due to config issues, try fallback as safety
      if (!isFirebaseFake && (error.code === 'auth/invalid-api-key' || error.code === 'auth/network-request-failed')) {
        console.warn('Firebase Auth service failed. Trying local MySQL fallback registration...');
        try {
          await api.post('/auth/register', { 
            name, 
            email, 
            address: address || '', 
            password, 
            role: role || 'Normal User' 
          });
          return { success: true };
        } catch (fallbackErr) {
          return { success: false, error: fallbackErr.response?.data?.message || 'Registration failed.' };
        }
      }

      let errMsg = 'Registration failed.';
      if (error.code === 'auth/email-already-in-use') {
        errMsg = 'Email is already registered in Firebase.';
      } else if (error.code === 'auth/weak-password') {
        errMsg = 'Password is too weak for Firebase Auth.';
      } else if (error.response?.data?.message) {
        errMsg = error.response.data.message;
      }
      return { success: false, error: errMsg };
    }
  };

  const forgotPassword = async (email) => {
    try {
      if (isFirebaseFake) {
        console.warn('Firebase placeholder detected. Forgot password bypassed locally.');
        return { success: true };
      }

      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error) {
      console.error('Forgot password error:', error);
      
      if (!isFirebaseFake && (error.code === 'auth/invalid-api-key' || error.code === 'auth/network-request-failed')) {
        return { success: true }; // Bypassed locally on network/key errors
      }

      let errMsg = 'Failed to send password reset email.';
      if (error.code === 'auth/user-not-found') {
        errMsg = 'No user account found with this email.';
      } else if (error.code === 'auth/invalid-email') {
        errMsg = 'Please enter a valid email address.';
      }
      return { success: false, error: errMsg };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const updatePassword = async (password) => {
    try {
      if (isFirebaseFake) {
        console.warn('Firebase placeholder detected. Updating local database password...');
        await api.put('/auth/update-password', { password });
        return { success: true };
      }

      // 1. Update password in Firebase Auth
      if (auth.currentUser) {
        await firebaseUpdatePassword(auth.currentUser, password);
      }

      // 2. Update password in MySQL database to keep in sync
      await api.put('/auth/update-password', { password });
      return { success: true };
    } catch (error) {
      console.error('Update password error:', error);
      let errMsg = 'Failed to update password.';
      if (error.code === 'auth/requires-recent-login') {
        errMsg = 'This operation is sensitive and requires recent authentication. Please log out and log back in to retry.';
      } else if (error.response?.data?.message) {
        errMsg = error.response.data.message;
      }
      return { success: false, error: errMsg };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        registerUser,
        forgotPassword,
        logout,
        updatePassword,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
