import { InputHTMLAttributes, ChangeEvent } from 'react';

// 工具函數：組合 CSS 類別
const cn = (...classes: (string | undefined | false)[]): string =>
  classes.filter(Boolean).join(' ');

// 輸入框位置類型
type InputPosition = 'top' | 'middle' | 'bottom' | 'single';

// HTML 輸入框類型
type InputType =
  | 'text'
  | 'email'
  | 'password'
  | 'tel'
  | 'url'
  | 'number'
  | 'search';

// FormInput 組件的 Props 介面
interface FormInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  /** 輸入元素的 ID */
  id: string;
  /** 輸入元素的 name 屬性 */
  name: string;
  /** 輸入框類型 */
  type?: InputType;
  /** 佔位符文字 */
  placeholder?: string;
  /** 輸入值 */
  value: string;
  /** 變更處理函數 */
  // eslint-disable-next-line no-unused-vars
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  /** 自動完成屬性 */
  autoComplete?: string;
  /** 是否為必填欄位 */
  required?: boolean;
  /** 標籤文字 */
  label: string;
  /** 輸入框在表單中的位置（影響邊角圓角樣式） */
  position?: InputPosition;
  /** 錯誤訊息 */
  error?: string;
}

function FormInput({
  id,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  autoComplete,
  required = false,
  label,
  position = 'middle',
  error,
  ...props
}: FormInputProps) {
  const inputBase =
    'appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm';

  const positionClasses: Record<InputPosition, string> = {
    top: 'rounded-t-md',
    middle: '',
    bottom: 'rounded-b-md',
    single: 'rounded-md',
  };

  const inputClasses = cn(
    inputBase,
    positionClasses[position],
    error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
  );

  return (
    <div>
      <label htmlFor={id} className='sr-only'>
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        value={value}
        onChange={onChange}
        className={inputClasses}
        placeholder={placeholder}
        {...props}
      />
      {error ? <p className='mt-1 text-sm text-red-600'>{error}</p> : null}
    </div>
  );
}

export default FormInput;
