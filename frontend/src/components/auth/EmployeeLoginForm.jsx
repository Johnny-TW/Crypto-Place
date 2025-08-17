import { useState } from 'react';
import { FormInput, FormButton } from '@components/forms';
import { ErrorMessage } from '@components/ui';

function EmployeeLoginForm({ onSubmit, isLoading, error }) {
  const [formData, setFormData] = useState({
    employeeId: '',
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit({ employeeId: formData.employeeId });
  };

  return (
    <form className='mt-8 space-y-6' onSubmit={handleSubmit}>
      <div className='rounded-md shadow-sm'>
        <ErrorMessage message={error} title='登入失敗' />

        <div className='mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md'>
          <div className='flex'>
            <div className='flex-shrink-0'>
              <svg
                className='h-5 w-5 text-blue-400'
                viewBox='0 0 20 20'
                fill='currentColor'
              >
                <path
                  fillRule='evenodd'
                  d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
                  clipRule='evenodd'
                />
              </svg>
            </div>
            <div className='ml-3'>
              <h3 className='text-sm font-medium text-blue-800'>
                員工快速登入
              </h3>
              <div className='mt-1 text-sm text-blue-700'>
                <p>
                  請輸入您的員工工號進行登入，系統將自動從 HR 系統撈取您的資料
                </p>
                <p className='mt-1 text-xs text-blue-600'>範例格式：11003736</p>
              </div>
            </div>
          </div>
        </div>

        <FormInput
          id='employee-id'
          name='employeeId'
          type='text'
          autoComplete='username'
          required
          value={formData.employeeId}
          onChange={handleChange}
          placeholder='請輸入員工工號'
          label='員工工號'
          position='single'
        />
      </div>

      <div>
        <FormButton type='submit' loading={isLoading} disabled={isLoading}>
          {isLoading ? '驗證中...' : '員工登入'}
        </FormButton>
      </div>

      <div className='text-center'>
        <div className='text-sm text-gray-600 bg-yellow-50 border border-yellow-200 rounded-md p-3'>
          <div className='flex items-start'>
            <div className='flex-shrink-0'>
              <svg
                className='h-5 w-5 text-yellow-400 mt-0.5'
                viewBox='0 0 20 20'
                fill='currentColor'
              >
                <path
                  fillRule='evenodd'
                  d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z'
                  clipRule='evenodd'
                />
              </svg>
            </div>
            <div className='ml-3'>
              <p className='text-sm text-yellow-800'>
                <strong>注意：</strong>員工登入僅適用於公司內部員工使用
              </p>
              <p className='text-xs text-yellow-700 mt-1'>
                如果您是一般用戶，請切換到「一般使用者」登入
              </p>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

export default EmployeeLoginForm;
