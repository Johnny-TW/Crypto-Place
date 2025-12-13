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

interface ProtectedRouteProps {
  children: ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated = false, isLoading = false } = useSelector(
    (state: RootState) => state.auth || {}
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  // 如果還在載入，顯示載入狀態
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // 如果未認證，不渲染任何內容（會被重定向到登入頁）
  if (!isAuthenticated) {
    return null;
  }

  return children;
}

export default ProtectedRoute;
