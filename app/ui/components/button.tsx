import clsx from "clsx";
import { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  style?: "primary" | "secondary";
  handleClick?: () => void;
  className?: string;
  type?: "submit" | "button";
};

export const Button = ({
  children,
  handleClick,
  style = "primary",
  className,
  type = "submit",
}: ButtonProps) => (
  <button
    type={type}
    className={clsx(
      "inline-flex items-center gap-x-1.5 rounded-full  px-6 py-2 text-sm text-white shadow-sm hover:bg-blue-600  duration-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600",
      style === "primary" ? "bg-blue-500" : "bg-gray-400 hover:bg-gray-500",
      className
    )}
    onClick={handleClick}
  >
    {children}
  </button>
);
