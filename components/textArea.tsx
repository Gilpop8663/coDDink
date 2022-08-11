import { UseFormRegisterReturn } from "react-hook-form";

interface TextAreaProps {
  name?: string;
  register: UseFormRegisterReturn;
  placeholder: string;
  [key: string]: any;
}

export default function TextArea({
  name,
  register,
  placeholder,
  ...rest
}: TextAreaProps) {
  return (
    <div>
      <textarea
        id={name}
        {...register}
        placeholder={placeholder}
        className="w-full rounded-md border p-2 text-sm font-semibold text-gray-600 placeholder:text-gray-400 hover:border-gray-700 focus:outline-none focus:ring focus:ring-blue-500"
        rows={4}
        {...rest}
      />
    </div>
  );
}
