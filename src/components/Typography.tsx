import React from "react";
import clsx from "clsx";

interface HeadingProps {
  children: React.ReactNode;
  className?: string;
  level?: 1 | 2 | 3 | 4; // H1 - H4
}

export const Heading: React.FC<HeadingProps> = ({ children, className, level = 2 }) => {
  const base = "font-extrabold tracking-tight text-gray-900";
  const sizes: Record<number, string> = {
    1: "text-4xl md:text-5xl",
    2: "text-3xl md:text-4xl",
    3: "text-2xl md:text-3xl",
    4: "text-xl md:text-2xl",
  };

  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  return <Tag className={clsx(base, sizes[level], className)}>{children}</Tag>;
};

interface TextProps {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "base" | "lg" | "xl";
  muted?: boolean;
}

export const Text: React.FC<TextProps> = ({ children, className, size = "base", muted }) => {
  const base = "leading-relaxed";
  const sizes: Record<string, string> = {
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg md:text-xl",
    xl: "text-xl md:text-2xl",
  };

  return (
    <p
      className={clsx(
        base,
        sizes[size],
        muted ? "text-gray-600" : "text-gray-800",
        className
      )}
    >
      {children}
    </p>
  );
};
