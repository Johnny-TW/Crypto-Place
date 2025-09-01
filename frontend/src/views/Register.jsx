import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { registerRequest } from '@redux/saga/auth';
import { RegisterForm, AuthHeader } from '@components/auth';

function Register() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { isLoading, error, isAuthenticated } = useSelector(
    state => state.auth
  );

  // 如果已經登入，重導向到 dashboard
  useEffect(() => {
    if (isAuthenticated) {
      history.replace('/dashboard');
    }
  }, [isAuthenticated, history]);

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

export default Register;
