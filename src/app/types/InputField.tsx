import React, { forwardRef } from "react";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", ...rest }, ref) => {
    return (
      <input
        ref={ref}
        {...rest}
        className={`w-full px-3 py-2 border rounded ${className}`}
      />
    );
  }
);

Input.displayName = "Input";
export default Input;
