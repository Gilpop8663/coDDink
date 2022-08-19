import {
  ChangeEvent,
  ChangeEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface TextAreaProps {
  kind?: "default" | "upload";
  label?: string;
  name?: string;
  register?: UseFormRegisterReturn;
  placeholder?: string;
  [key: string]: any;
}

export default function TextArea({
  kind = "default",
  label,
  name,
  register,
  placeholder,
  ...rest
}: TextAreaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [currentValue, setCurrentValue] = useState(""); // you can manage data with it

  const onChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (!e) return;
    setCurrentValue(e.target.value);
  };

  useEffect(() => {
    if (textareaRef.current === null) return;
    textareaRef.current.style.height = "0px";
    const scrollHeight = textareaRef.current.scrollHeight;
    textareaRef.current.style.height = scrollHeight + "px";
  }, [currentValue]);

  return (
    <div>
      {kind === "default" && (
        <>
          <label className="text-sm" htmlFor={name}>
            {label}
          </label>
          <textarea
            id={name}
            {...register}
            placeholder={placeholder}
            className="mt-4 w-full rounded-md border p-2 text-sm font-semibold text-gray-600 placeholder:text-gray-400 hover:border-gray-700 focus:outline-none focus:ring focus:ring-blue-500"
            rows={4}
            {...rest}
          />
        </>
      )}
      {kind === "upload" && (
        <div className="flex h-fit justify-center">
          <label htmlFor={name}>{label}</label>
          <textarea
            ref={textareaRef}
            id={name}
            {...register}
            value={currentValue}
            onChange={onChange}
            placeholder={"여기에 텍스트 입력..."}
            className="h-fit w-4/5 justify-center border-blue-600 text-xl scrollbar-hide placeholder:text-xl hover:border focus:border focus:outline-none"
            {...rest}
          ></textarea>
        </div>
      )}
    </div>
  );
}
