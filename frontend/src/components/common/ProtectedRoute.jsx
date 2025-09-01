import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useSelector(state => state.auth || {});
  const history = useHistory();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      history.replace('/login');
    }
  }, [isAuthenticated, isLoading, history]);

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
