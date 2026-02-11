import React from "react";

export type NavbarVariant = "light" | "dark";

interface NavbarItem {
  label: string;
  onClick?: () => void;
}

interface NavbarProps {
  brand?: string;
  items?: NavbarItem[];
  actions?: React.ReactNode;
  variant?: NavbarVariant;
}

const variantStyles: Record<NavbarVariant, string> = {
  light: "bg-white border-b border-gray-200 text-gray-900",
  dark: "bg-gray-900 text-white",
};

export const Navbar: React.FC<NavbarProps> = ({
  brand,
  items = [],
  actions,
  variant = "light",
}) => {
  return (
    <nav className={`w-full px-6 py-3 flex items-center justify-between ${variantStyles[variant]}`}>
      <div className="flex items-center gap-6">
        {brand && (
          <span className="text-lg font-semibold">
            {brand}
          </span>
        )}

        <div className="flex items-center gap-4">
          {items.map((item, index) => (
            <button
              key={index}
              onClick={item.onClick}
              className="text-sm hover:opacity-80 transition-opacity"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {actions && (
        <div className="flex items-center gap-3">
          {actions}
        </div>
      )}
    </nav>
  );
};
