import { cls } from "@libs/client/utils";
import { ContentProps } from "pages/portfolio/editor";
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";

interface PreivewTextProps {
  label?: string;
  name?: string;
  idx: number;
  setContent: Dispatch<SetStateAction<ContentProps[]>>;
  [key: string]: any;
}

export default function PreivewText({
  label,
  name,
  idx,
  setContent,
  ...rest
}: PreivewTextProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [currentValue, setCurrentValue] = useState("");
  const [isWrite, setIsWrite] = useState(true);

  const onChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (!e) return;
    setCurrentValue(e.target.value);
    setContent((prev) => {
      const curValue = { ...prev[idx!], description: currentValue };
      const newContent = [
        ...prev.slice(0, idx),
        curValue,
        ...prev.slice(idx + 1),
      ];

      return newContent;
    });
  };

  useEffect(() => {
    if (textareaRef.current === null) return;
    textareaRef.current.style.height = "0px";
    const scrollHeight = textareaRef.current.scrollHeight;
    textareaRef.current.style.height = scrollHeight + "px";

    if (currentValue.length > 0) {
      setIsWrite(true);
    }
  }, [currentValue]);

  useEffect(() => {
    if (textareaRef.current === null) return;
    textareaRef.current.addEventListener("focusout", () => {
      if (textareaRef.current?.innerText === "") {
        setIsWrite(false);
      } else {
        setIsWrite(true);
      }
    });
  }, []);

  return (
    <div className={cls(!isWrite ? "hidden h-0" : "visible")}>
      <div className={cls("flex h-fit justify-center ")}>
        <label htmlFor={name}>{label}</label>
        <textarea
          ref={textareaRef}
          id={name}
          value={currentValue}
          autoFocus
          onChange={onChange}
          placeholder={"여기에 텍스트 입력..."}
          className="h-fit w-4/5 justify-center border-blue-600 text-xl scrollbar-hide placeholder:text-xl hover:border focus:border focus:outline-none"
          {...rest}
        ></textarea>
      </div>
    </div>
  );
}
