import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllMechanics } from "../../Api/admin";
import { MechData } from "../../interfaces/IComponents/Common/ICommonInterfaces";


const TableCommon2 = () => {
  const rowsLimit = 5;
  const [mechs, setMechs] = useState<MechData[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsToShow, setRowsToShow] = useState<MechData[]>([]);
  const totalPage = Math.ceil(mechs.length / rowsLimit);
  const navigate = useNavigate();

  // Fetch data from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAllMechanics();
        const fetchedMechs = res?.data?.data?.mechs || [];
        // Filter mechanics to show only those with isVerified: false
        const unverifiedMechs = fetchedMechs.filter(
          (mech: MechData) => !mech.isVerified
        );
        setMechs(unverifiedMechs);
        setRowsToShow(unverifiedMechs.slice(0, rowsLimit));
      } catch (error) {
        console.error("Error fetching mechanics data:", error);
      }
    };

    fetchData();
  }, []);

  // Update rowsToShow whenever currentPage changes
  useEffect(() => {
    setRowsToShow(
      mechs.slice(currentPage * rowsLimit, (currentPage + 1) * rowsLimit)
    );
  }, [currentPage, mechs]);

  // Pagination handlers
  const nextPage = () => {
    if (currentPage < totalPage - 1) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const previousPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const changePage = (page: number) => {
    setCurrentPage(page);
  };

  // Navigate to the mechanic details page
  const handleRowClick = (id: string) => {
    navigate(`/admin/mechanic/details/${id}`);
  };

  return (
    <div className="min-h-screen h-full bg-white flex items-center justify-center pt-10 pb-14">
      <div className="w-full max-w-4xl px-2">
        <h1 className="text-2xl font-medium">
          Unverified Mechanics Table With Pagination
        </h1>
        <div className="w-full overflow-x-auto mt-2">
          {mechs.length === 0 ? (
            // Show message if no mechanics to verify
            <div className="text-center text-gray-500 text-lg py-10">
              No mechanic to verify
            </div>
          ) : (
            <>
              <table className="table-auto w-full text-left font-inter border">
                <thead className="text-base text-white font-semibold">
                  <tr className="bg-gray-100">
                    <th className="py-3 px-3 text-gray-800 sm:text-base font-bold">
                      Name
                    </th>
                    <th className="py-3 px-3 text-gray-800 sm:text-base font-bold">
                      Email
                    </th>
                    <th className="py-3 px-3 text-gray-800 sm:text-base font-bold">
                      Blocked
                    </th>
                    <th className="py-3 px-3 text-gray-800 sm:text-base font-bold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rowsToShow.map((mech) => (
                    <tr
                      key={mech._id}
                      className="border-b cursor-pointer hover:bg-gray-100 transition"
                      onClick={() => handleRowClick(mech._id)}
                    >
                      <td className="py-2 px-3">{mech.name}</td>
                      <td className="py-2 px-3">{mech.email}</td>
                      <td className="py-2 px-3">
                        {mech.isBlocked ? "Yes" : "No"}
                      </td>
                      <td className="py-2 px-3">
                        <button
                          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent row click
                            handleRowClick(mech._id);
                          }}
                        >
                          View More
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="flex justify-between mt-4">
                <button
                  onClick={previousPage}
                  disabled={currentPage === 0}
                  className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
                >
                  Previous
                </button>

                {Array(totalPage)
                  .fill(null)
                  .map((_, index) => (
                    <button
                      key={index}
                      onClick={() => changePage(index)}
                      className={`px-3 py-2 mx-1 rounded-md ${
                        index === currentPage
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200"
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}

                <button
                  onClick={nextPage}
                  disabled={currentPage >= totalPage - 1}
                  className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TableCommon2;