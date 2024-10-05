import AdminHeader from "../../components/Admin/AdminHeader";
import AdminListing from "../../components/Admin/AdminListing";
import TableCommon from "../../components/Common/TableCommon";
import { blockMech, getAllMechanics } from "../../Api/admin";
import { useState } from "react";
import { useEffect } from "react";



interface MechData{
  _id:string;
  name:string;
  email:string;
  isBlocked:boolean;
  isDeleted:boolean;

}

const AdminMechListing: React.FC = () => {

  const [mechs,setMech] = useState<MechData[]>([]);

    useEffect(() => {
      const fetchData = async () => {
        try{
          const res = await getAllMechanics();
          console.log("Mech details in the first useEeffect");
          setMech(res?.data?.data?.mechs);
        }catch(error){
          console.log(error as Error);
        }
      };
      fetchData();
    },[])
  

    const updateMechStatus = (id: string, isBlocked: boolean) => {
      setMech((prevUsers) =>
        prevUsers.map((mech) =>
          mech._id === id ? { ...mech, isBlocked } : mech
        )
      );
    };


  return (
    <div className="h-screen flex">
      {/* side bar */}
      <AdminListing />
      {/* Contents */}
      <div className="w-3/4 bg-[#DFECF8]">
        <div>
          <AdminHeader heading="Mechanics" />
          <div className="flex justify-center items-center">
            <TableCommon data={mechs} updateUserStatus={updateMechStatus} blockUnblockFunciton={blockMech} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMechListing;
