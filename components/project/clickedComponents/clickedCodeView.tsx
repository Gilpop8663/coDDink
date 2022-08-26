import React from "react";
import dynamic from "next/dynamic";
import "@uiw/react-textarea-code-editor/dist.css";
import { cls } from "@libs/client/utils";

const CodeEditor: any = dynamic(
  () =>
    import("@uiw/react-textarea-code-editor").then((mod: any) => mod.default),
  { ssr: false }
);

interface CodeViewProps {
  content: string | null;
  language: string | null;
  fontSize: string | null;
}

export default function ClickedCodeView({
  content,
  language,
  fontSize,
}: CodeViewProps) {
  return (
    <div className={cls(`${fontSize}`, "bg-[#f5f5f5] p-4 font-mono")}>
      <CodeEditor
        readOnly
        value={content}
        language={language}
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
      />
    </div>
  );
}
