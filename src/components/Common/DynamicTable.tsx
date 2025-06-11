import React, { useState, useEffect } from "react";

type ColumnType<T> = {
  key: keyof T;
  header: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
};

type DynamicTableProps<T> = {
  columns: ColumnType<T>[];
  data: T[];
  title?: string;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
  onRowClick?: (row: T) => void;
  itemsPerPageOptions?: number[];
  defaultItemsPerPage?: number;
};

const DynamicTable = <T extends Record<string, unknown>>({
  columns,
  data,
  title = "Data Table",
  loading = false,
  emptyMessage = "No data available",
  className = "",
  onRowClick,
  itemsPerPageOptions = [5, 25, 50, 100],
  defaultItemsPerPage = 5,
}: DynamicTableProps<T>) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState(data);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);

  // Search function to filter data
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredData(data);
    } else {
      const lowercaseQuery = searchQuery.toLowerCase();
      const filtered = data.filter((item) => {
        // Search through all columns of the item
        return columns.some((column) => {
          const value = item[column.key];
          // Check if the value exists and includes the search query
          return (
            value !== undefined &&
            value !== null &&
            String(value).toLowerCase().includes(lowercaseQuery)
          );
        });
      });
      setFilteredData(filtered);
    }

    setCurrentPage(1);
  }, [searchQuery, data, columns]);

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  console.log("currentItems are ", currentItems);

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5; // Show up to 5 page numbers at once

    let startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    // Adjust start page if end page is maxed out
    if (endPage === totalPages) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  // Helper function to safely render cell value
  const renderCellValue = (item: T, column: ColumnType<T>) => {
    const value = item[column.key];

    if (column.render) {
      return column.render(value, item);
    }

    // Handle different value types safely
    if (value === null || value === undefined) {
      return "";
    }

    if (typeof value === "object") {
      return JSON.stringify(value);
    }

    return String(value);
  };

  return (
    <div className={`relative py-4 bg-blueGray-50 ${className}`}>
      <div className="w-full mb-6 px-4">
        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white text-black">
          <div className="flex flex-wrap justify-between rounded-t mb-0 px-2 mt-6 border-0">
            <div className="flex flex-wrap items-center">
              <div className="relative w-full max-w-full flex-grow flex-1 my-4 justify-start">
                <h3 className="font-bold font-exo text-xl text-black">
                  {title}
                </h3>
              </div>
            </div>

            {/* Search Input with increased border radius */}
            <div className="my-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-500"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                    />
                  </svg>
                </div>
                <input
                  type="search"
                  id="table-search"
                  className="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-full w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search in table..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
          </div>

          <div className="block w-full overflow-x-auto h-screen">
            {loading ? (
              <div className="p-6 text-center">Loading data...</div>
            ) : filteredData.length === 0 ? (
              <div className="p-6 text-center">
                {searchQuery ? "No results found" : emptyMessage}
              </div>
            ) : (
              <table className="items-center w-full bg-transparent border-collapse">
                <thead>
                  <tr>
                    {columns.map((column) => (
                      <th
                        key={String(column.key)}
                        className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-gray-700 text-white"
                      >
                        {column.header}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {currentItems.map((item, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-300 cursor-pointer hover:bg-gray-200 transition duration-200"
                      onClick={() => onRowClick && onRowClick(item)}
                    >
                      {columns.map((column) => (
                        <td
                          key={`${index}-${String(column.key)}`}
                          className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
                        >
                          {renderCellValue(item, column)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination Controls */}
          {filteredData.length > 0 && (
            <div className="flex flex-wrap items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
              <div className="flex items-center text-sm text-gray-700">
                <span className="mr-2">Showing</span>
                <span className="font-medium">{indexOfFirstItem + 1}</span>
                <span className="mx-1">to</span>
                <span className="font-medium">
                  {Math.min(indexOfLastItem, totalItems)}
                </span>
                <span className="mx-1">of</span>
                <span className="font-medium">{totalItems}</span>
                <span className="ml-1">results</span>

                <div className="ml-8 flex items-center">
                  <span className="mr-2">Rows per page:</span>
                  <select
                    value={itemsPerPage}
                    onChange={handleItemsPerPageChange}
                    className="border rounded-md py-1 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {itemsPerPageOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end mt-2 sm:mt-0">
                <nav
                  className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                  aria-label="Pagination"
                >
                  {/* First page button */}
                  <button
                    onClick={() => goToPage(1)}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                      currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <span className="sr-only">First</span>
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>

                  {/* Previous page button */}
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                      currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <span className="sr-only">Previous</span>
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>

                  {/* Page numbers */}
                  {getPageNumbers().map((number) => (
                    <button
                      key={number}
                      onClick={() => goToPage(number)}
                      className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                        currentPage === number
                          ? "z-10 bg-blue-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                          : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                      }`}
                    >
                      {number}
                    </button>
                  ))}

                  {/* Next page button */}
                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                      currentPage === totalPages
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    <span className="sr-only">Next</span>
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>

                  {/* Last page button */}
                  <button
                    onClick={() => goToPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                      currentPage === totalPages
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    <span className="sr-only">Last</span>
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DynamicTable;
