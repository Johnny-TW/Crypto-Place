import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

function LoginRedirect({ children }) {
  const { isAuthenticated, isLoading } = useSelector(state => state.auth || {});
  const history = useHistory();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      history.push('/dashboard');
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
