import { ReactNode, ButtonHTMLAttributes } from 'react';

// 工具函數：組合 CSS 類別
const cn = (...classes: (string | undefined | false)[]): string =>
  classes.filter(Boolean).join(' ');

// 按鈕變體類型
type ButtonVariant = 'primary' | 'secondary';

// 按鈕尺寸類型
type ButtonSize = 'sm' | 'md' | 'lg';

// 按鈕位置類型（用於表單內的按鈕排列）
type ButtonType = 'button' | 'submit' | 'reset';

// FormButton 組件的 Props 介面
interface FormButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  /** 按鈕類型 */
  type?: ButtonType;
  /** 是否禁用按鈕 */
  disabled?: boolean;
  /** 是否顯示載入狀態 */
  loading?: boolean;
  /** 按鈕內容 */
  children: ReactNode;
  /** 按鈕變體樣式 */
  variant?: ButtonVariant;
  /** 按鈕尺寸 */
  size?: ButtonSize;
}

function FormButton({
  type = 'button',
  disabled = false,
  loading = false,
  children,
  variant = 'primary',
  size = 'md',
  ...props
}: FormButtonProps) {
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

  const variantClasses: Record<ButtonVariant, string[]> = {
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

  const sizeClasses: Record<ButtonSize, string> = {
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
