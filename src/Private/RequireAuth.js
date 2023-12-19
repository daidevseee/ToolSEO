// src/Private/RequireAuth.js

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../Service/firebase';
import { onAuthStateChanged } from "firebase/auth";

const RequireAuth = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        navigate('/login');
      }
    });
    return unsubscribe;
  }, [navigate]);

  if (!user) {
    return <div>Loading...</div>; // Hoặc một component loading tùy chỉnh
  }

  return children;
};

export default RequireAuth;
