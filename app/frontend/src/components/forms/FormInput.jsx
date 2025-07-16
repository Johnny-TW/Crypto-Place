// 工具函數：組合 CSS 類別
const cn = (...classes) => classes.filter(Boolean).join(' ');

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
  ...props
}) {
  const inputBase =
    'appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm';

  const positionClasses = {
    top: 'rounded-t-md',
    middle: '',
    bottom: 'rounded-b-md',
    single: 'rounded-md',
  };

  const inputClasses = cn(inputBase, positionClasses[position]);

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
    </div>
  );
}

export default FormInput;
