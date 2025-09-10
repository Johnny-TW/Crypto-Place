import React from 'react';

interface ErrorMessageProps {
  message?: string;
  title?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  title = '錯誤',
}) => {
  if (!message) return null;

  return (
    <div className='rounded-md bg-red-50 p-4 mb-4'>
      <div className='flex'>
        <div className='ml-3'>
          <h3 className='text-sm font-medium text-red-800'>{title}</h3>
          <div className='mt-2 text-sm text-red-700'>
            <p>{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;
