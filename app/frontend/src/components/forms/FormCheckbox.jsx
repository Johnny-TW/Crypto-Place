function FormCheckbox({ id, name, checked, onChange, label, ...props }) {
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
