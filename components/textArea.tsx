import { UseFormRegisterReturn } from "react-hook-form";

interface TextAreaProps {
  name?: string;
  register: UseFormRegisterReturn;
  [key: string]: any;
}

export default function TextArea({ name, register, ...rest }: TextAreaProps) {
  return (
    <div>
      <textarea
        id={name}
        {...register}
        className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 "
        rows={4}
        {...rest}
      />
    </div>
  );
}
