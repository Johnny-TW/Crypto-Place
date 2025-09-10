import React, { useEffect, ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

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
  const history = useHistory();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      history.replace('/dashboard');
    }
  }, [isAuthenticated, isLoading, history]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated) {
    return null;
  }

  return children;
}

export default LoginRedirect;
