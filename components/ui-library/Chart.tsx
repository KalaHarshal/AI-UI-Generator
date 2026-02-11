import React from "react";

export interface ChartDataPoint {
  label: string;
  value: number; // 0–100
}

interface ChartProps {
  data: ChartDataPoint[];
  height?: "sm" | "md" | "lg";
}

const heightStyles = {
  sm: "h-40",
  md: "h-56",
  lg: "h-72",
};

function getHeightClass(value: number): string {
  if (value <= 20) return "h-1/5";
  if (value <= 40) return "h-2/5";
  if (value <= 60) return "h-3/5";
  if (value <= 80) return "h-4/5";
  return "h-full";
}

export const Chart: React.FC<ChartProps> = ({
  data,
  height = "md",
}) => {
  return (
    <div
      className={`
        bg-white border border-gray-200 rounded-lg p-5
      `}
    >
      <div
        className={`
          w-full ${heightStyles[height]}
          flex items-end gap-4
        `}
      >
        {data.map((point, index) => (
          <div
            key={index}
            className="flex flex-col items-center flex-1 h-full"
          >
            <div
              className={`
                w-full bg-blue-500 rounded-t-md
                ${getHeightClass(point.value)}
              `}
            />
            <span className="text-xs text-gray-600 mt-2">
              {point.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
