import { useDispatch, useSelector } from 'react-redux';
import { AuthHeader, LoginForm } from '@components/auth';

function Login() {
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector(state => state.auth || {});

  const handleSubmit = formData => {
    dispatch({ type: 'LOGIN_REQUEST', payload: formData });
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8'>
        <AuthHeader />
        <LoginForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </div>
  );
}

export default Login;
