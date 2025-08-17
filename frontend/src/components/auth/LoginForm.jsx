import { useState } from 'react';
import { FormInput, FormButton, FormCheckbox } from '@components/forms';
import { ErrorMessage } from '@components/ui';

function LoginForm({ onSubmit, isLoading, error }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    // 只傳送後端需要的欄位
    const { email, password } = formData;
    onSubmit({ email, password });
  };

  return (
    <form className='mt-8 space-y-6' onSubmit={handleSubmit}>
      <input type='hidden' name='remember' defaultValue='true' />

      <div className='rounded-md shadow-sm -space-y-px'>
        <ErrorMessage message={error} title='登入失敗' />

        <FormInput
          id='email-address'
          name='email'
          type='email'
          autoComplete='email'
          required
          value={formData.email}
          onChange={handleChange}
          placeholder='Email 地址'
          label='Email 地址'
          position='top'
        />

        <FormInput
          id='password'
          name='password'
          type='password'
          autoComplete='current-password'
          required
          value={formData.password}
          onChange={handleChange}
          placeholder='密碼'
          label='密碼'
          position='bottom'
        />
      </div>

      <div className='flex items-center justify-between'>
        <FormCheckbox
          id='remember-me'
          name='rememberMe'
          checked={formData.rememberMe}
          onChange={handleChange}
          label='記住我'
        />

        <div className='text-sm'>
          <a
            href='#'
            className='font-medium text-indigo-600 hover:text-indigo-500'
          >
            忘記密碼？
          </a>
        </div>
      </div>

      <div>
        <FormButton type='submit' loading={isLoading} disabled={isLoading}>
          {isLoading ? '登入中...' : '登入'}
        </FormButton>
      </div>

      <div className='text-center'>
        <p className='text-sm text-gray-600'>
          還沒有帳戶？{' '}
          <a
            href='/register'
            className='font-medium text-indigo-600 hover:text-indigo-500'
          >
            立即註冊
          </a>
        </p>
      </div>
    </form>
  );
}

export default LoginForm;
