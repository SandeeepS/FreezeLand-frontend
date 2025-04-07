import React from "react";
import { Circle } from "lucide-react";

// Define the base data item type with optional fields
export interface TableDataItem {
  [key: string]: any;
}

// Define the column configuration
export interface TableColumn {
  key: string;
  header: string;
  render?: (value: any, item: TableDataItem) => React.ReactNode;
}

// Define the table props
interface DynamicTableProps {
  columns: TableColumn[];
  data: TableDataItem[];
  title?: string;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
  onRowClick?: (item: TableDataItem) => void;
}

// Helper function to get status color
export const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case "pending":
      return "text-orange-500";
    case "completed":
      return "text-emerald-500";
    case "delayed":
      return "text-orange-500";
    case "on schedule":
      return "text-teal-500";
    default:
      return "text-gray-500";
  }
};

// Helper function to get progress bar colors
export const getProgressColors = (status: string) => {
  switch (status.toLowerCase()) {
    case "completed":
    case "on schedule":
      return {
        bg: "bg-emerald-200",
        bar: "bg-emerald-500",
      };
    case "delayed":
    case "pending":
      return {
        bg: "bg-red-200",
        bar: "bg-red-500",
      };
    default:
      return {
        bg: "bg-gray-200",
        bar: "bg-gray-500",
      };
  }
};

const DynamicTable: React.FC<DynamicTableProps> = ({
  columns,
  data,
  title = "Data Table",
  loading = false,
  emptyMessage = "No data available",
  className = "",
  onRowClick,
}) => {
  return (
    <div className={`relative py-6 bg-blueGray-50 ${className}`}>
      <div className="w-full mb-6 px-4">
        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white text-black">
          <div className="rounded-t mb-0 px-4 py-3 border-0">
            <div className="flex flex-wrap items-center">
              <div className="relative w-full px-1 max-w-full flex-grow flex-1 my-4">
                <h3 className="font-bold text-xl text-black">{title}</h3>
              </div>
            </div>
          </div>

          <div className="block w-full overflow-x-auto">
            {loading ? (
              <div className="p-6 text-center">Loading data...</div>
            ) : data.length === 0 ? (
              <div className="p-6 text-center">{emptyMessage}</div>
            ) : (
              <table className="items-center w-full bg-transparent border-collapse">
                <thead>
                  <tr>
                    {columns.map((column) => (
                      <th
                        key={column.key}
                        className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-gray-700 text-white"
                      >
                        {column.header}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {data.map((item, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-300 cursor-pointer hover:bg-gray-200 transition duration-200"
                      onClick={() => onRowClick && onRowClick(item)}
                    >
                      {columns.map((column) => (
                        <td
                          key={`${index}-${column.key}`}
                          className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
                        >
                          {column.render
                            ? column.render(item[column.key], item)
                            : item[column.key]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicTable;
