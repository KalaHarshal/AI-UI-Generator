import React from "react";

export type CardVariant = "default" | "bordered" | "elevated";
export type CardPadding = "none" | "sm" | "md" | "lg";

interface CardProps {
  title?: string;
  subtitle?: string;
  variant?: CardVariant;
  padding?: CardPadding;
  children?: React.ReactNode;
  footer?: React.ReactNode;
}

const variantStyles: Record<CardVariant, string> = {
  default: "bg-white",
  bordered: "bg-white border border-gray-200",
  elevated: "bg-white shadow-md",
};

const paddingStyles: Record<CardPadding, string> = {
  none: "p-0",
  sm: "p-3",
  md: "p-5",
  lg: "p-7",
};

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  variant = "default",
  padding = "md",
  children,
  footer,
}) => {
  return (
    <div className={`rounded-lg ${variantStyles[variant]}`}>
      {(title || subtitle) && (
        <div className="border-b border-gray-200 px-5 py-3">
          {title && <h3 className="text-lg font-semibold">{title}</h3>}
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
      )}

      <div className={paddingStyles[padding]}>{children}</div>

      {footer && (
        <div className="border-t border-gray-200 px-5 py-3">
          {footer}
        </div>
      )}
    </div>
  );
};
