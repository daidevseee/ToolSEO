import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../Service/firebase';
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const RequireRole = ({ children, allowedRoles }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const unsubscribeUser = onSnapshot(doc(db, "users-vietnix", user.uid), (doc) => {
          const userData = doc.data();
          if (allowedRoles.includes(userData.role)) {
            setCurrentUser(userData);
          } else {
            toast.error("Bạn không có quyền truy cập chức năng này!")
            navigate('/'); // Chuyển hướng đến trang không có quyền
          }
        });

        return () => unsubscribeUser();
      } else {
        navigate('/login');
      }
    });

    return unsubscribe;
  }, [navigate, allowedRoles]);

  if (!currentUser) {
    return <div>Loading...</div>;
  }
  return children;
};

export default RequireRole;
