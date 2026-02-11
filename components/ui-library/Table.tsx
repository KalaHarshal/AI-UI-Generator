import React from "react";

export interface TableColumn {
  key: string;
  header: string;
}

export interface TableProps {
  columns: TableColumn[];
  data: Record<string, any>[];
  striped?: boolean;
  hoverable?: boolean;
}

export const Table: React.FC<TableProps> = ({
  columns,
  data,
  striped = false,
  hoverable = true,
}) => {
  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-full border border-gray-200 rounded-md overflow-hidden">
        <thead className="bg-gray-100 border-b border-gray-200">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-4 py-3 text-left text-sm font-semibold text-gray-700"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-8 text-center text-sm text-gray-500"
              >
                No data available
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={`
                  border-b border-gray-200
                  ${striped && rowIndex % 2 === 1 ? "bg-gray-50" : ""}
                  ${hoverable ? "hover:bg-gray-100 transition-colors" : ""}
                `}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className="px-4 py-3 text-sm text-gray-900"
                  >
                    {row[column.key] ?? "-"}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
