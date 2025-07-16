import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginRequest } from '../../redux/saga/auth';

function SignAccount() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const dispatch = useDispatch();
  const { isLoading, error } = useSelector(state => state.auth || {});

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    dispatch(loginRequest(formData));
  };

  return (
    <div className='flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8'>
      <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
        <img
          alt='Your Company'
          src='https://tailwindui.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600'
          className='mx-auto h-10 w-auto'
        />
        <h2 className='mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900'>
          Sign in to your account
        </h2>
      </div>

      <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
        <form onSubmit={handleSubmit} className='space-y-6'>
          {error ? (
            <div className='rounded-md bg-red-50 p-4'>
              <div className='text-sm text-red-700'>{error}</div>
            </div>
          ) : null}

          <div>
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label
              htmlFor='email'
              className='block text-sm/6 font-medium text-gray-900'
            >
              Email address
            </label>
            <div className='mt-2'>
              <input
                id='email'
                name='email'
                type='email'
                required
                autoComplete='email'
                value={formData.email}
                onChange={handleChange}
                className={
                  'block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 ' +
                  'outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 ' +
                  'focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'
                }
                placeholder='test@example.com'
              />
            </div>
          </div>

          <div>
            <div className='flex items-center justify-between'>
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label
                htmlFor='password'
                id='password-label'
                className='block text-sm/6 font-medium text-gray-900'
              >
                Password
              </label>
              <div className='text-sm'>
                <a
                  href='#'
                  className='font-semibold text-indigo-600 hover:text-indigo-500'
                >
                  Forgot password?
                </a>
              </div>
            </div>
            <div className='mt-2'>
              <input
                id='password'
                name='password'
                type='password'
                required
                autoComplete='current-password'
                aria-labelledby='password-label'
                value={formData.password}
                onChange={handleChange}
                className={
                  'block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 ' +
                  'outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 ' +
                  'focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'
                }
                placeholder='password123'
              />
            </div>
          </div>

          <div>
            <button
              type='submit'
              disabled={isLoading}
              className={
                `flex w-full justify-center rounded-md px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs ` +
                `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
                  isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-500'
                }`
              }
            >
              {isLoading ? '登入中...' : 'Sign in'}
            </button>
          </div>
        </form>

        <p className='mt-10 text-center text-sm/6 text-gray-500'>
          Not a member?{' '}
          <a
            href='#'
            className='font-semibold text-indigo-600 hover:text-indigo-500'
          >
            Start a 14 day free trial
          </a>
        </p>
      </div>
    </div>
  );
}

export default SignAccount;
