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
  onAddCodeArea: (e: React.MouseEvent<HTMLDivElement>, idx?: number) => void;
  onChange: ChangeEventHandler<HTMLTextAreaElement>;
  onClearClick: (idx: number) => void;
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
  onAddCodeArea,
  onClearClick,
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
      const curContent = { ...prev[idx], fontSize: e.target.value };

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

  const onAlignText = (kind: number) => {
    const result =
      kind === 1 ? "text-left" : kind === 2 ? "text-center" : "text-right";
    setAlignText(result);

    setContent((prev) => {
      const curContent = { ...prev[idx], alignText: result };

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
          onAddCodeArea={onAddCodeArea}
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
            title="?????? ?????? ?????????"
            className="cursor-pointer  rounded-sm bg-gray-700 text-white ring-blue-600 hover:ring-2 focus:bg-gray-700"
            name="fontOption"
            id=""
            value={fontSize}
            onChange={onOptionChange}
          >
            <option className="bg-gray-700 " value="text-2xl">
              ??????
            </option>
            <option value="text-lg">????????????</option>
            <option defaultChecked value="text-base">
              ??????
            </option>
            <option value="text-sm">??????</option>
          </select>
          <div
            title="?????? ??????"
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
            title="??????"
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
            title="????????? ??????"
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
          <div
            className="cursor-pointer"
            title="????????????"
            onClick={() => onClearClick(idx)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
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
          autoFocus
          placeholder={"????????? ????????? ??????..."}
          className={cls(
            fontSize && `${fontSize} placeholder:${fontSize}`,
            alignText && `${alignText}`,
            "h-fit w-4/5 resize-none justify-center whitespace-pre-wrap  border-blue-600 scrollbar-hide placeholder:text-xl hover:border focus:border focus:outline-none"
          )}
          {...rest}
        ></textarea>
      </div>
    </div>
  );
}
