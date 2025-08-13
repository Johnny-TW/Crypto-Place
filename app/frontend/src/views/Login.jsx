import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AuthHeader, UserLoginForm, EmployeeLoginForm } from '@components/auth';

function Login() {
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector(state => state.auth || {});
  const [activeTab, setActiveTab] = useState('user'); // 'user' | 'employee'

  const handleUserLogin = formData => {
    dispatch({ type: 'LOGIN_REQUEST', payload: formData });
  };

  const handleEmployeeLogin = formData => {
    dispatch({ type: 'EMPLOYEE_LOGIN_REQUEST', payload: formData });
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8'>
        <AuthHeader />

        {/* Tab 切換器 */}
        <div className='border-b border-gray-200'>
          <nav className='-mb-px flex space-x-8'>
            <button
              type='button'
              onClick={() => setActiveTab('user')}
              className={`${
                activeTab === 'user'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200`}
            >
              一般使用者
            </button>
            <button
              type='button'
              onClick={() => setActiveTab('employee')}
              className={`${
                activeTab === 'employee'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200`}
            >
              員工登入
            </button>
          </nav>
        </div>

        {/* 動態表單內容 */}
        <div className='mt-8'>
          {activeTab === 'user' ? (
            <UserLoginForm
              onSubmit={handleUserLogin}
              isLoading={isLoading}
              error={error}
            />
          ) : (
            <EmployeeLoginForm
              onSubmit={handleEmployeeLogin}
              isLoading={isLoading}
              error={error}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
