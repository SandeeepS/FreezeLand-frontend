import React, { useEffect, useState } from "react";
import { blockUser, getAllMechanics } from "../../Api/admin";
import Swal from "sweetalert2";
// import { Button, Pagination, Tooltip } from "@nextui-org/react";
import toast from "react-hot-toast";
import { MechData } from "../../interfaces/IComponents/Admin/IAdminInterfaces";


const MechDataListing: React.FC = () => {
  const [mechanics, setMechanics] = useState<MechData[]>([]);
  const [block, setBlock] = useState(false);

  useEffect(() => {
    const fetctData = async () => {
      try {
        const res = await getAllMechanics();
        console.log("MechDatas is ", res);
        setMechanics(res?.data.data.mechs);
      } catch (error) {
        console.log(error as Error);
      }
    };
    fetctData();
  }, []);

  const handleBlock = async (id: string) => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes!",
      }).then((result) => {
        if (result.isConfirmed) {
          blockUser(id).then((result) => {
            if (result?.message) {
              setBlock(!block);
              Swal.fire({
                title: "success!",
                text: "",
                icon: "success",
              });
            } else toast.error(result?.message);
          });
        }
      });
    } catch (error) {
      console.log(error as Error);
    }
  };

  return (
    <div className="xl:w-3/4 2xl:w-4/5 w-full">
      <div className="px-4 md:px-10 py-4 md:py-7">
        <div className="sm:flex items-center justify-between">
          <p
            tabIndex={0}
            className="focus:outline-none text-base sm:text-lg md:text-xl lg:text-2xl font-bold leading-normal text-gray-800 dark:text-white"
          >
            {/* Files */}
          </p>
          <div className="mt-4 sm:mt-0">
            <button className="focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 inline-flex sm:ml-3 items-start justify-start px-6 py-3 bg-indigo-700 hover:bg-indigo-600 focus:outline-none rounded">
              <p className="text-sm font-medium leading-none text-white">
                Add New User
              </p>
            </button>
          </div>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-900 px-4 md:px-10 pb-5">
        <div className="overflow-x-auto">
          <table className="w-full whitespace-nowrap text-white">
            <tbody>
              {mechanics? mechanics.map((mech) => (
                <tr
                  key={mech._id}
                  tabIndex={0}
                  className="focus:outline-none text-sm leading-none text-gray-600 dark:text-gray-200 h-16"
                >
                  <td className="w-1/2">
                    <div className="flex items-center">
                      <div className="pl-2">
                        <p className="text-sm font-medium leading-none text-gray-800 dark:text-white">
                          {mech.name}
                        </p>
                        <p className="text-xs leading-3 text-gray-600 dark:text-gray-200 mt-2">
                          {mech.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="pl-16">
                    {mech.isBlocked ? "Blocked" : "Active"}
                  </td>
                  <td className="pl-16">
                    <button
                      onClick={() => handleBlock(mech._id)}
                      className={`px-4 py-2 rounded text-white ${
                        mech.isBlocked ? "bg-red-500" : "bg-green-500"
                      }`}
                    >
                      {mech.isBlocked ? "Unblock" : "Block"}
                    </button>
                  </td>
                  <td className="pl-16">
                    <button
                      onClick={() => handleBlock(mech._id)}
                      className={`px-4 py-2 rounded text-white bg-blue-500`}
                    >
                      Edit
                    </button>
                  </td>


                  <td className="pl-16">
                    <button
                      onClick={() => handleBlock(mech._id)}
                      className={`px-4 py-2 rounded text-white bg-red-500`}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              )) : "No Mechanics"}
            </tbody>
          </table>
        </div>
      </div>
      {/* <Pagination className='ms-10 mb-3 ' total={10} initialPage={1} /> */}

    </div>
  );
};

export default MechDataListing;
