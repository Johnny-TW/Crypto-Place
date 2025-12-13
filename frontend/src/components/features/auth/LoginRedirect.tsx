import React, { useEffect, ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

interface AuthState {
  isAuthenticated?: boolean;
  isLoading?: boolean;
}

interface RootState {
  auth?: AuthState;
}

interface LoginRedirectProps {
  children: ReactNode;
}

function LoginRedirect({ children }: LoginRedirectProps) {
  const { isAuthenticated = false, isLoading = false } = useSelector(
    (state: RootState) => state.auth || {}
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated) {
    return null;
  }

  return children;
}

export default LoginRedirect;
