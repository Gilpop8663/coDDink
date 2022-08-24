import { cls } from "@libs/client/utils";
import { ContentProps } from "pages/portfolio/editor";
import {
  ChangeEvent,
  ChangeEventHandler,
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import MiniUploadMenu from "./miniUploadMenu";

interface PreivewTextProps {
  label?: string;
  name?: string;
  idx: number;
  setContent: Dispatch<SetStateAction<ContentProps[]>>;
  onPreviewImage: (
    e: React.ChangeEvent<HTMLInputElement>,
    idx?: number
  ) => void;
  textValue: string;
  onAddTextArea: (e: React.MouseEvent<HTMLDivElement>, idx?: number) => void;
  onChange: ChangeEventHandler<HTMLTextAreaElement>;
  [key: string]: any;
}

export default function PreivewText({
  label,
  name,
  idx,
  setContent,
  onAddTextArea,
  onPreviewImage,
  textValue,
  onChange,
  ...rest
}: PreivewTextProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  // const [currentValue, setCurrentValue] = useState(textValue);
  const [isWrite, setIsWrite] = useState(true);
  const [fontSize, setFontSize] = useState("text-base");
  const [alignText, setAlignText] = useState("text-left");
  const [isOver, setIsOver] = useState(false);

  const onOverArea = () => {
    setIsOver(true);
  };

  const onOutArea = () => {
    setIsOver(false);
  };

  const onWrite = () => {
    setIsWrite(true);
  };

  const onOptionChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setFontSize(e.target.value);

    setContent((prev) => {
      const curContent = { ...prev[idx], fontSize: fontSize };

      let newContent;

      console.log(curContent);

      if (idx === 0) {
        newContent = [curContent, ...prev.slice(idx + 1)];
      } else {
        newContent = [
          ...prev.slice(0, idx),
          curContent,
          ...prev.slice(idx + 1),
        ];
      }

      return newContent;
    });
  };

  const onAlignText = (kind: number) => {
    if (kind === 1) {
      setAlignText("text-left");
    } else if (kind === 2) {
      setAlignText("text-center");
    } else if (kind === 3) {
      setAlignText("text-right");
    }

    setContent((prev) => {
      const curContent = { ...prev[idx], alignText: alignText };

      let newContent;

      if (idx === 0) {
        newContent = [curContent, ...prev.slice(idx + 1)];
      } else {
        newContent = [
          ...prev.slice(0, idx),
          curContent,
          ...prev.slice(idx + 1),
        ];
      }

      return newContent;
    });
  };

  useEffect(() => {
    if (textareaRef.current === null) return;
    textareaRef.current.style.height = "0px";
    const scrollHeight = textareaRef.current.scrollHeight;
    textareaRef.current.style.height = scrollHeight + "px";
  }, [textValue, fontSize]);

  useEffect(() => {
    if (textareaRef.current === null) return;
    textareaRef.current.addEventListener("focusout", () => {
      setIsWrite(false);
    });
    textareaRef.current.addEventListener("focusin", () => {
      setIsWrite(true);
    });
  }, []);

  return (
    <div
      onMouseOut={onOutArea}
      onMouseOver={onOverArea}
      className={cls(
        !isWrite && textValue.length === 0 ? "hidden h-0" : "visible",
        "relative"
      )}
    >
      {(isWrite || textValue.length > 0) && (
        <MiniUploadMenu
          onAddTextArea={onAddTextArea}
          idx={idx}
          onPreviewImage={onPreviewImage}
        />
      )}
      {isOver && (
        <div
          onMouseOver={onWrite}
          className="absolute -top-4 flex items-center space-x-4 rounded-md bg-gray-700  px-4 py-2 text-white"
        >
          <select
            title="서식 지정 스타일"
            className="cursor-pointer  rounded-sm bg-gray-700 text-white ring-blue-600 hover:ring-2 focus:bg-gray-700"
            name="fontOption"
            id=""
            value={fontSize}
            onChange={onOptionChange}
          >
            <option className="bg-gray-700 " value="text-2xl">
              헤더
            </option>
            <option value="text-lg">서브헤더</option>
            <option defaultChecked value="text-base">
              단락
            </option>
            <option value="text-sm">캡션</option>
          </select>
          <div
            title="왼쪽 정렬"
            onClick={() => onAlignText(1)}
            className=" cursor-pointer rounded-md p-1 hover:bg-gray-400"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </div>
          <div
            title="중앙"
            onClick={() => onAlignText(2)}
            className="cursor-pointer rounded-md p-1 hover:bg-gray-400"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </div>
          <div
            title="오른쪽 정렬"
            onClick={() => onAlignText(3)}
            className="cursor-pointer rounded-md p-1 hover:bg-gray-400"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </div>
        </div>
      )}
      <div className={cls("flex h-fit justify-center ")}>
        <label htmlFor={name}>{label}</label>
        <textarea
          ref={textareaRef}
          id={name}
          value={textValue}
          onChange={onChange}
          placeholder={"여기에 텍스트 입력..."}
          className={cls(
            fontSize && `${fontSize} placeholder:${fontSize}`,
            alignText && `${alignText}`,
            "h-fit w-4/5 resize-none justify-center border-blue-600  scrollbar-hide placeholder:text-xl hover:border focus:border focus:outline-none"
          )}
          {...rest}
        ></textarea>
      </div>
    </div>
  );
}
