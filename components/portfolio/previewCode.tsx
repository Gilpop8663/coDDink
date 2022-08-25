import React, {
  ChangeEventHandler,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import "@uiw/react-textarea-code-editor/dist.css";
import dynamic from "next/dynamic";
import { TextareaCodeEditorProps } from "@uiw/react-textarea-code-editor";
import { ContentProps } from "pages/portfolio/editor";
import MiniUploadMenu from "./miniUploadMenu";
import { cls } from "@libs/client/utils";

const CodeEditor: any = dynamic(
  () =>
    import("@uiw/react-textarea-code-editor").then((mod: any) => mod.default),
  { ssr: false }
);

interface PreivewCodeProps {
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

export default function PreviewCode({
  setContent,
  idx,
  onAddCodeArea,
  onPreviewImage,
  onAddTextArea,
  onChange,
  onClearClick,
  textValue,
}: PreivewCodeProps) {
  const [isOver, setIsOver] = useState(false);
  const [language, setLanguage] = useState("jsx");
  const [fontSize, setFontSize] = useState("text-base");

  const onOverArea = () => {
    setIsOver(true);
  };

  const onOutArea = () => {
    setIsOver(false);
  };

  const onLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.currentTarget.value);

    setContent((prev) => {
      const curContent = { ...prev[idx], language: language };

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

  const onOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFontSize(e.target.value);

    setContent((prev) => {
      const curContent = { ...prev[idx], fontSize: fontSize };

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
    console.log(language);
  }, [language]);

  return (
    <div className="relative" onMouseOut={onOutArea} onMouseOver={onOverArea}>
      {isOver && (
        <div className="absolute -top-4 flex items-center justify-between space-x-2 rounded-md bg-gray-700 px-4 py-2 text-white">
          <select
            title="언어 설정"
            className="cursor-pointer  rounded-sm bg-gray-700 text-white ring-blue-600 hover:ring-2 focus:bg-gray-700"
            onChange={onLanguageChange}
            value={language}
            name="langOption"
          >
            <option value="abap">Language: abap</option>
            <option value="aes">Language: aes</option>
            <option value="apex">Language: apex</option>
            <option value="azcli">Language: azcli</option>
            <option value="bat">Language: bat</option>
            <option value="bicep">Language: bicep</option>
            <option value="brainfuck">Language: brainfuck</option>
            <option value="c">Language: c</option>
            <option value="cameligo">Language: cameligo</option>
            <option value="clike">Language: clike</option>
            <option value="clojure">Language: clojure</option>
            <option value="coffeescript">Language: coffeescript</option>
            <option value="cpp">Language: cpp</option>
            <option value="csharp">Language: csharp</option>
            <option value="csp">Language: csp</option>
            <option value="css">Language: css</option>
            <option value="dart">Language: dart</option>
            <option value="dockerfile">Language: dockerfile</option>
            <option value="ecl">Language: ecl</option>
            <option value="elixir">Language: elixir</option>
            <option value="erlang">Language: erlang</option>
            <option value="flow9">Language: flow9</option>
            <option value="freemarker2">Language: freemarker2</option>
            <option value="fsharp">Language: fsharp</option>
            <option value="go">Language: go</option>
            <option value="graphql">Language: graphql</option>
            <option value="handlebars">Language: handlebars</option>
            <option value="hcl">Language: hcl</option>
            <option value="html">Language: html</option>
            <option value="ini">Language: ini</option>
            <option value="java">Language: java</option>
            <option value="javascript">Language: javascript</option>
            <option value="json">Language: json</option>
            <option value="jsx">Language: jsx</option>
            <option value="julia">Language: julia</option>
            <option value="kotlin">Language: kotlin</option>
            <option value="less">Language: less</option>
            <option value="lex">Language: lex</option>
            <option value="lexon">Language: lexon</option>
            <option value="liquid">Language: liquid</option>
            <option value="livescript">Language: livescript</option>
            <option value="lua">Language: lua</option>
            <option value="m3">Language: m3</option>
            <option value="markdown">Language: markdown</option>
            <option value="mips">Language: mips</option>
            <option value="msdax">Language: msdax</option>
            <option value="mysql">Language: mysql</option>
            <option value="nginx">Language: nginx</option>
            <option value="objective-c">Language: objective-c</option>
            <option value="pascal">Language: pascal</option>
            <option value="pascaligo">Language: pascaligo</option>
            <option value="perl">Language: perl</option>
            <option value="pgsql">Language: pgsql</option>
            <option value="php">Language: php</option>
            <option value="pla">Language: pla</option>
            <option value="plaintext">Language: plaintext</option>
            <option value="postiats">Language: postiats</option>
            <option value="powerquery">Language: powerquery</option>
            <option value="powershell">Language: powershell</option>
            <option value="proto">Language: proto</option>
            <option value="pug">Language: pug</option>
            <option value="python">Language: python</option>
            <option value="qsharp">Language: qsharp</option>
            <option value="r">Language: r</option>
            <option value="razor">Language: razor</option>
            <option value="redis">Language: redis</option>
            <option value="redshift">Language: redshift</option>
            <option value="restructuredtext">Language: restructuredtext</option>
            <option value="ruby">Language: ruby</option>
            <option value="rust">Language: rust</option>
            <option value="sb">Language: sb</option>
            <option value="scala">Language: scala</option>
            <option value="scheme">Language: scheme</option>
            <option value="scss">Language: scss</option>
            <option value="shell">Language: shell</option>
            <option value="sol">Language: sol</option>
            <option value="sparql">Language: sparql</option>
            <option value="sql">Language: sql</option>
            <option value="st">Language: st</option>
            <option value="stylus">Language: stylus</option>
            <option value="swift">Language: swift</option>
            <option value="systemverilog">Language: systemverilog</option>
            <option value="tcl">Language: tcl</option>
            <option value="toml">Language: toml</option>
            <option value="tsx">Language: tsx</option>
            <option value="twig">Language: twig</option>
            <option value="typescript">Language: typescript</option>
            <option value="vb">Language: vb</option>
            <option value="vbscript">Language: vbscript</option>
            <option value="verilog">Language: verilog</option>
            <option value="vue">Language: vue</option>
            <option value="xml">Language: xml</option>
            <option value="yaml">Language: yaml</option>
          </select>
          <div>
            <select
              onChange={onOptionChange}
              title="서식 지정 스타일"
              name="fontSize"
              id=""
              value={fontSize}
              className="cursor-pointer  rounded-sm bg-gray-700 text-white ring-blue-600 hover:ring-2 focus:bg-gray-700"
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
          </div>
          <div
            className="cursor-pointer"
            title="삭제하기"
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
      {textValue.length > 0 && (
        <MiniUploadMenu
          onAddCodeArea={onAddCodeArea}
          onAddTextArea={onAddTextArea}
          idx={idx}
          onPreviewImage={onPreviewImage}
        />
      )}
      <div
        className={cls(fontSize && `${fontSize}`, "bg-[#f5f5f5] p-4 font-mono")}
      >
        <CodeEditor
          style={{
            fontSize:
              fontSize === "text-2xl"
                ? 18
                : fontSize === "text-lg"
                ? 16
                : fontSize === "text-base"
                ? 14
                : 12,
          }}
          value={textValue}
          onChange={onChange}
          language={language}
          placeholder={`Please enter ${language} code.`}
        />
      </div>
    </div>
  );
}
