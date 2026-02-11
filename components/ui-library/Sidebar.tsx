import React from "react";

export interface SidebarItem {
  label: string;
  active?: boolean;
  onClick?: () => void;
}

interface SidebarProps {
  title?: string;
  items: SidebarItem[];
  footer?: React.ReactNode;
  width?: "sm" | "md" | "lg";
}

const widthStyles: Record<NonNullable<SidebarProps["width"]>, string> = {
  sm: "w-48",
  md: "w-64",
  lg: "w-72",
};

export const Sidebar: React.FC<SidebarProps> = ({
  title,
  items,
  footer,
  width = "md",
}) => {
  return (
    <aside
      className={`
        h-screen bg-white border-r border-gray-200
        flex flex-col justify-between
        ${widthStyles[width]}
      `}
    >
      <div>
        {title && (
          <div className="px-5 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">{title}</h2>
          </div>
        )}

        <nav className="flex flex-col gap-1 p-3">
          {items.map((item, index) => (
            <button
              key={index}
              onClick={item.onClick}
              className={`
                text-left px-3 py-2 rounded-md text-sm transition-colors
                ${
                  item.active
                    ? "bg-blue-100 text-blue-700"
                    : "hover:bg-gray-100 text-gray-700"
                }
              `}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {footer && (
        <div className="border-t border-gray-200 p-3">
          {footer}
        </div>
      )}
    </aside>
  );
};
