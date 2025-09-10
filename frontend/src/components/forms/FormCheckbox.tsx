import { InputHTMLAttributes, ChangeEvent } from 'react';

// FormCheckbox 組件的 Props 介面
interface FormCheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  /** 輸入元素的 ID */
  id: string;
  /** 輸入元素的 name 屬性 */
  name: string;
  /** 是否已選中 */
  checked: boolean;
  /** 變更處理函數 */
  // eslint-disable-next-line no-unused-vars
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  /** 標籤文字 */
  label: string;
}

function FormCheckbox({
  id,
  name,
  checked,
  onChange,
  label,
  ...props
}: FormCheckboxProps) {
  return (
    <div className='flex items-center'>
      <label
        htmlFor={id}
        className='ml-2 text-sm text-gray-900 flex items-center'
      >
        <input
          id={id}
          name={name}
          type='checkbox'
          checked={checked}
          onChange={onChange}
          className='h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mr-2'
          {...props}
        />
        {label}
      </label>
    </div>
  );
}

export default FormCheckbox;
