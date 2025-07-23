import { useState } from 'react';
import { FormInput, FormButton } from '@components/forms';
import { ErrorMessage } from '@components/ui';

function RegisterForm({ onSubmit, isLoading, error }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [validationErrors, setValidationErrors] = useState({});

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = '姓名為必填欄位';
    } else if (formData.name.trim().length < 2) {
      errors.name = '姓名至少需要 2 個字元';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email 為必填欄位';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = '請輸入有效的 Email 格式';
    }

    if (!formData.password) {
      errors.password = '密碼為必填欄位';
    } else if (formData.password.length < 6) {
      errors.password = '密碼至少需要 6 個字元';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = '請確認密碼';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = '密碼確認不一致';
    }

    return errors;
  };

  const handleSubmit = e => {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    const { name, email, password } = formData;
    onSubmit({ name, email, password });
  };

  return (
    <form className='mt-8 space-y-6' onSubmit={handleSubmit}>
      <div className='rounded-md shadow-sm space-y-4'>
        <ErrorMessage message={error} title='註冊失敗' />

        <FormInput
          id='name'
          name='name'
          type='text'
          autoComplete='name'
          required
          value={formData.name}
          onChange={handleChange}
          placeholder='姓名'
          label='姓名'
          error={validationErrors.name}
        />

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
          error={validationErrors.email}
        />

        <FormInput
          id='password'
          name='password'
          type='password'
          autoComplete='new-password'
          required
          value={formData.password}
          onChange={handleChange}
          placeholder='密碼'
          label='密碼'
          error={validationErrors.password}
        />

        <FormInput
          id='confirm-password'
          name='confirmPassword'
          type='password'
          autoComplete='new-password'
          required
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder='確認密碼'
          label='確認密碼'
          error={validationErrors.confirmPassword}
        />
      </div>

      <div>
        <FormButton type='submit' loading={isLoading} disabled={isLoading}>
          {isLoading ? '註冊中...' : '立即註冊'}
        </FormButton>
      </div>

      <div className='text-center'>
        <p className='text-sm text-gray-600'>
          已經有帳戶了？{' '}
          <a
            href='/login'
            className='font-medium text-indigo-600 hover:text-indigo-500'
          >
            立即登入
          </a>
        </p>
      </div>
    </form>
  );
}

export default RegisterForm;
