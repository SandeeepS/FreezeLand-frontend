import React from "react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState , useEffect} from "react";
import { getAllDevices,deleteDevice, listUnlistDevices } from "../../Api/admin";
import TableCommon from "../../components/Common/TableCommon";
import TopBar from "../../components/Admin/Dashboard/TopBar";


interface DeviceData {
  _id: string;
  name: string;
  isBlocked: boolean;
  isDeleted: boolean;
}

const AdminDeviceListing: React.FC = () => {
  const [devices, setDevices] = useState<DeviceData[]>([]);
  const heading = "Adding new Device";

  const columns = [
    { id: "name", label: "Name", minWidth: 170 },
    {
      id: "isBlocked",
      label: "Status",
      minWidth: 170,
      align: "right",
      format: (value: boolean) => (value ? "Blocked" : "Active"),
    },
    { id: "actions", label: "Actions", minWidth: 150, align: "right" },
  ];

  useEffect(() => {
    const fetchData  = async () => {
      try{
        console.log("entered in the useEffect in the adminservice listing ");
        const result = await getAllDevices();
        console.log("result reached in the frontend", result);
        if(result?.data){
          setDevices(result?.data?.data?.devices)
        }
      }catch(error){
        console.log(error as Error);
      }
    }

    fetchData();
  },[])



  const updateDeviceStatus = (
    id: string,
    isBlocked: boolean,
    isDeleted: boolean
  ) => {
    setDevices((prevDevice) =>
      isDeleted
        ? prevDevice.filter((devices) => devices._id !== id)
        : prevDevice.map((devices) =>
            devices._id === id ? { ...devices, isBlocked } : devices
          )
    );
  };


  const navigate = useNavigate();
  const handleClick = () => {
    console.log("button clicked");
    navigate("/admin/addNewDevice");
  };

  const navigationLink = '/admin/editDevice/';


  return (
    <div className=" flex flex-col">
      <div className="fixed top-0 w-full">
        <TopBar heading={heading}/>
      </div>
      <div className="flex justify-end mx-10 ">
        <Button className="" onClick={handleClick} variant="contained">
          Add new Device
        </Button>
      </div> 

      <div className="flex justify-center items-center mx-10  h-screen">
        <TableCommon
          columns={columns}
          data={devices}
          updateStatus={updateDeviceStatus}
          blockUnblockFunciton={listUnlistDevices}
          deleteFunction={deleteDevice}
          navLink={navigationLink}
        />
      </div>
    </div>
  );
};

export default AdminDeviceListing;
