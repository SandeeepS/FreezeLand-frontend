import TableCommon from "../../components/Common/TableCommon";
import { blockMech, getAllMechanics } from "../../Api/admin";
import { useState } from "react";
import { useEffect } from "react";
import { deleteMech } from "../../Api/admin";
import AdminHeader from "../../components/Admin/AdminHeader";

interface MechData {
  _id: string;
  name: string;
  email: string;
  isBlocked: boolean;
  isDeleted: boolean;
}

const AdminMechListing: React.FC = () => {

  const columns = [
    { id: "name", label: "Name", minWidth: 170 },
    { id: "email", label: "Email", minWidth: 100 },
    { id: "isBlocked", label: "Status", minWidth: 170, align: "right", format: (value: boolean) => (value ? "Blocked" : "Active") },
    { id: "actions", label: "Actions", minWidth: 150, align: "right" }
  ];


  const [mechs, setMech] = useState<MechData[]>([]);
  const header = "Mechanics";
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
        ? prevMechs.filter((mech) => mech._id !== id) // Remove deleted mech
        : prevMechs.map((mech) =>
            mech._id === id ? { ...mech, isBlocked } : mech
          )
    );
  };

  return (
    <div>
      <AdminHeader heading={header} />
      <div className="flex justify-center items-center mx-10 pt-7 h-screen">
        <TableCommon
         columns={columns}
          data={mechs}
          updateUserStatus={updateMechStatus}
          blockUnblockFunciton={blockMech}
          deleteUser={deleteMech}
        />
      </div>
    </div>
  );
};

export default AdminMechListing;
