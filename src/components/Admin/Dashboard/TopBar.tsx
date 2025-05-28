import { useState, useEffect, ChangeEvent } from "react";
import { TopBarProps } from "../../../interfaces/IComponents/Admin/IAdminInterfaces";
import { useNavigate } from "react-router-dom";
// import { FiCalendar } from "react-icons/fi";

const TopBar: React.FC<TopBarProps> = ({
  pathName,
  heading,
  searchQuery,
  onSearchChange,
}) => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState(searchQuery);
  const [inputDebounce, setinputDebounce] = useState(" ");

  // Debounce search input to prevent excessive API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setinputDebounce(inputValue as string);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [inputValue, searchQuery]);

  console.log("inputDebounce", inputDebounce);
  useEffect(() => {
    if (inputDebounce !== null) {
      if (inputDebounce.trim()) {
        console.log("pathnanme", pathName);
        navigate(`${pathName}?search= ${inputDebounce}`);
      } else {
        navigate(`${pathName}`);
      }
    }
  }, [inputDebounce]);

  return (
    <div className="border-b mt-2  bg-white">
      <div className="flex items-center justify-between p-0.5">
        <div>
          <span className="text-2xl font-bold block px-2">{heading}</span>

          {/* <span className="text-2xl font-bold block">🚀 {heading}</span>
          <span className="text-sm block text-stone-500">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
          </span> */}
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
            <label htmlFor="server-search" className="sr-only">
              Search
            </label>
            <div className="relative w-full">
              <input
                type="text"
                id="server-search"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search here..."
                value={inputValue}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setInputValue(e.target.value)
                }
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
