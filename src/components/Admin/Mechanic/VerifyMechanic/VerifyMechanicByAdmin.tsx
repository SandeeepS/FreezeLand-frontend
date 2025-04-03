import React, { useEffect, useState } from "react";
import TopBar from "../../Dashboard/TopBar";
import { getAllMechanics } from "../../../../Api/admin";
import TableCommon2 from "../../../Common/TableCommon2";

interface MechData {
  _id: string;
  name: string;
  email: string;
  isBlocked: boolean;
  isDeleted: boolean;
}

const VerifyMechanicByAdmin: React.FC = () => {
  const heading = "Verify Mechanic";

  const columns = [
    {id:"name", label:"Name",minWidth:170},
    {id:"email", label:"Email",minWidth:100},
    {id:"status", label:"Status",minWidth:100},
  ]

  const [mechs,setMech] = useState<MechData[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try{
        const res = await getAllMechanics();
        console.log("Mech Details ",res);
        setMech(res?.data?.data?.mechs);
        console.log("Mech Details in the first useEffect",mechs);

      }catch(error){
        console.log(error);
        throw new Error;
      }
    }
    fetchData();
  },[])
  
  return (
    <div className="MainDiv flex flex-col  h-screen">
      <div>
        <TopBar heading={heading}/>
      </div>
      <div className="mt-12 mx-4 h-screen">
        {/**Table for listing verified mechanics */}
        <TableCommon2/>
      </div>
    </div>
  );
};

export default VerifyMechanicByAdmin;
