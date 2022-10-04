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
    <div className={cls(`${fontSize}`, "p-4")}>
      <CodeEditor
        readOnly
        value={content}
        language={language}
        style={{
          fontFamily:
            "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
          backgroundColor: "#f5f5f5",
          fontSize:
            fontSize === "text-2xl"
              ? 18
              : fontSize === "text-lg"
              ? 16
              : fontSize === "text-base"
              ? 14
              : 12,
        }}
        padding={15}
      />
    </div>
  );
}
