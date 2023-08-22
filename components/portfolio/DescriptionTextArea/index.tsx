import React from 'react';

export default function DescriptionTextArea() {
  return (
    <div
      className="border w-full h-screen bg-white p-2 text-base md:text-lg"
      contentEditable
      aria-multiline
      role="textbox"
      aria-label="글 내용 입력"
    />
  );
}
