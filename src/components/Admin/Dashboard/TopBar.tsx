import { FiCalendar } from "react-icons/fi";
const TopBar = ({heading}) => {
  return (
    <div className="border-b px-4 mt-2  mx-4 bg-white">
      <div className="flex items-center justify-between p-0.5">
        <div>
          <span className="text-2xl font-bold block">🚀 {heading}</span>
          <span className="text-sm block text-stone-500">
            Tuesday, Aug 8th 2023
          </span>
        </div>

        <button className="flex text-sm items-center gap-2 bg-stone-100 transition-colors hover:bg-violet-100 hover:text-violet-700 px-3 py-1.5 rounded">
          <FiCalendar />
          <span>Prev 6 Months</span>
        </button>
      </div>
    </div>
  );
};

export default TopBar;
