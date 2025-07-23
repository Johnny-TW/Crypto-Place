// 工具函數：組合 CSS 類別
const cn = (...classes) => classes.filter(Boolean).join(' ');

function FormButton({
  type = 'button',
  disabled = false,
  loading = false,
  children,
  variant = 'primary',
  size = 'md',
  ...props
}) {
  const baseClasses = [
    'group',
    'relative',
    'w-full',
    'flex',
    'justify-center',
    'py-2',
    'px-4',
    'border',
    'text-sm',
    'font-medium',
    'rounded-md',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-offset-2',
  ];

  const variantClasses = {
    primary: [
      'border-transparent',
      'text-white',
      'focus:ring-indigo-500',
      disabled || loading
        ? 'bg-gray-400 cursor-not-allowed'
        : 'bg-indigo-600 hover:bg-indigo-700',
    ],
    secondary: [
      'border-gray-300',
      'text-gray-700',
      'bg-white',
      'hover:bg-gray-50',
      'focus:ring-indigo-500',
    ],
  };

  const sizeClasses = {
    sm: 'py-1 px-2 text-xs',
    md: 'py-2 px-4 text-sm',
    lg: 'py-3 px-6 text-base',
  };

  const buttonClasses = cn(
    ...baseClasses,
    ...variantClasses[variant],
    sizeClasses[size]
  );

  return (
    <button
      type={type === 'submit' ? 'submit' : 'button'}
      disabled={disabled || loading}
      className={buttonClasses}
      {...props}
    >
      {loading ? (
        <span className='absolute left-0 inset-y-0 flex items-center pl-3'>
          <svg
            className={cn(
              'h-5 w-5',
              loading
                ? 'text-gray-300'
                : 'text-indigo-500 group-hover:text-indigo-400'
            )}
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 20 20'
            fill='currentColor'
            aria-hidden='true'
          >
            <path
              fillRule='evenodd'
              d='M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z'
              clipRule='evenodd'
            />
          </svg>
        </span>
      ) : null}
      {children}
    </button>
  );
}

export default FormButton;
