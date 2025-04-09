import { ChangeEvent } from "react";
import { TopBarProps } from "../../../interfaces/IComponents/Admin/IAdminInterfaces";

// import { FiCalendar } from "react-icons/fi";


const TopBar: React.FC<TopBarProps> = ({
  heading,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <div className="border-b px-4 mt-2  mx-4 bg-white">
      <div className="flex items-center justify-between p-0.5">
        <div>
          <span className="text-2xl font-bold block">🚀 {heading}</span>
          <span className="text-sm block text-stone-500">
            Tuesday, Aug 8th 2023
          </span>
        </div>

        {/* <button className="flex text-sm items-center gap-2 bg-stone-100 transition-colors hover:bg-violet-100 hover:text-violet-700 px-3 py-1.5 rounded">
          <FiCalendar />
          <span>Prev 6 Months</span>
        </button> */}
        <div>
          <form
            className="flex items-center max-w-sm mx-auto"
            onSubmit={(e) => e.preventDefault()}
          >
            <label htmlFor="simple-search" className="sr-only">
              Search
            </label>
            <div className="relative w-full">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none"></div>
              <input
                type="text"
                id="simple-search"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search here..."
                value={searchQuery}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  onSearchChange(e.target.value)
                }
              />
            </div>
            {/* <button
              type="submit"
              className="p-2.5 ms-2 text-sm font-medium text-white bg-freeze-color rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              <svg
                className="w-4 h-4"
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
              <span className="sr-only">Search</span>
            </button> */}
          </form>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
