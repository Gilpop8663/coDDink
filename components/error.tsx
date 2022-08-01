import React from "react";
import { cls } from "@libs/client/utils";
import { FieldError } from "react-hook-form";

interface ErrorMessageType {
  visible?: boolean;
  children: React.ReactNode;
}

function ErrorMessage({ visible = true, children }: ErrorMessageType) {
  return (
    <p
      className={cls(
        visible
          ? "mt-4 flex items-center text-sm font-medium text-[#AE1644]"
          : "hidden"
      )}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
      <span className="ml-1">{children}</span>
    </p>
  );
}

export default ErrorMessage;
