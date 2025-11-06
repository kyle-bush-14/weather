"use client";

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
}

export default function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg p-3">
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }} className="font-medium">
            {entry.name}: {entry.value} {entry.unit || ""}
          </p>
        ))}
      </div>
    );
  }
  return null;
}
