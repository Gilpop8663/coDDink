import { UseFormRegisterReturn } from 'react-hook-form';

interface TextAreaProps {
  label?: string;
  name?: string;
  register?: UseFormRegisterReturn;
  placeholder?: string;
  [key: string]: any;
}

export default function TextArea({
  label,
  name,
  register,
  placeholder,
  ...rest
}: TextAreaProps) {
  return (
    <div>
      <label className="text-sm" htmlFor={name}>
        {label}
      </label>

      <textarea
        id={name}
        {...register}
        placeholder={placeholder}
        className="w-full resize-none rounded-md border p-2 text-sm font-semibold text-gray-600 placeholder:text-gray-400 hover:border-gray-700 focus:outline-none focus:ring focus:ring-blue-500"
        rows={4}
        {...rest}
      />
    </div>
  );
}
