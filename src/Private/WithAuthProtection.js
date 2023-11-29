import React from 'react';
import { useNavigate } from 'react-router-dom';

const WithAuthProtection = (WrappedComponent) => {
  const AuthProtectedComponent = (props) => {
    const navigate = useNavigate();
    const authData = JSON.parse(localStorage.getItem('authData'));

    if (!authData) {
      navigate('/');
      return null;
    }

    const { authTimestamp, permissions } = authData;
    const currentPath = window.location.pathname;

    if ((new Date().getTime() - authTimestamp) >= 3600000 || !permissions.includes(currentPath)) {
      navigate('/');
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  return AuthProtectedComponent;
};

export default WithAuthProtection;
