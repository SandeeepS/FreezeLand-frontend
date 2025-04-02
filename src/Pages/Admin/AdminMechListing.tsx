import TableCommon from "../../components/Common/TableCommon";
import { blockMech, getAllMechanics } from "../../Api/admin";
import { useState } from "react";
import { useEffect } from "react";
import { deleteMech } from "../../Api/admin";
import TopBar from "../../components/Admin/Dashboard/TopBar";
import { useNavigate } from "react-router-dom";

interface MechData {
  _id: string;
  name: string;
  email: string;
  isBlocked: boolean;
  isDeleted: boolean;
}

const AdminMechListing: React.FC = () => {
  const navigate = useNavigate();
  const columns = [
    { id: "name", label: "Name", minWidth: 170 },
    { id: "email", label: "Email", minWidth: 100 },
    {
      id: "isBlocked",
      label: "Status",
      minWidth: 170,
      align: "right",
      format: (value: boolean) => (value ? "Blocked" : "Active"),
    },
    { id: "actions", label: "Actions", minWidth: 150, align: "right" },
  ];

  const [mechs, setMech] = useState<MechData[]>([]);
  const heading = "Mechanics";
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAllMechanics();
        console.log("Mech details in the first useEeffect");
        setMech(res?.data?.data?.mechs);
      } catch (error) {
        console.log(error as Error);
      }
    };
    fetchData();
  }, []);

  const updateMechStatus = (
    id: string,
    isBlocked: boolean,
    isDeleted: boolean
  ) => {
    setMech((prevMechs) =>
      isDeleted
        ? prevMechs.filter((mech) => mech._id !== id)
        : prevMechs.map((mech) =>
            mech._id === id ? { ...mech, isBlocked } : mech
          )
    );
  };

  const handleVerifyMechanic = () => {
    console.log("button clicked");
    navigate("/admin/verifyMechanic");
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="mb-5">
        <TopBar heading={heading} />
      </div>
      <div className="flex justify-end p-4">
        <button
          type="button"
          className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-1 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          onClick={handleVerifyMechanic}
        >
          Verify Mechanic
        </button>
      </div>
      <div className="flex justify-center items-center mx-10 pt-7 h-screen">
        <TableCommon
          columns={columns}
          data={mechs}
          updateStatus={updateMechStatus}
          blockUnblockFunciton={blockMech}
          deleteFunction={deleteMech}
        />
      </div>
    </div>
  );
};

export default AdminMechListing;
