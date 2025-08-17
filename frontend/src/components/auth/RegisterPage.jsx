import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { registerRequest } from '@redux/saga/auth';
import RegisterForm from './RegisterForm';
import AuthHeader from './AuthHeader';

function RegisterPage() {
  const dispatch = useDispatch();
  const { isLoading, error, isAuthenticated } = useSelector(
    state => state.auth
  );

  // 如果已經登入，重導向到 dashboard
  useEffect(() => {
    if (isAuthenticated) {
      window.location.href = '/dashboard';
    }
  }, [isAuthenticated]);

  const handleRegister = userData => {
    dispatch(registerRequest(userData));
  };

  return (
    <div className='min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8'>
        <AuthHeader title='建立新帳戶' subtitle='加入我們的加密貨幣平台' />

        <RegisterForm
          onSubmit={handleRegister}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </div>
  );
}

export default RegisterPage;
