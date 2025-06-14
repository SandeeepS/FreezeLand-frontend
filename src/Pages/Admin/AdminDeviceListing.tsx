import React from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  getAllDevices,
  deleteDevice,
  listUnlistDevices,
} from "../../Api/admin";
import TableCommon from "../../components/Common/TableCommon";
import TopBar from "../../components/Admin/Dashboard/TopBar";
import { DeviceData } from "../../interfaces/IPages/Admin/IAdminInterfaces";
import CommonButtonSpace from "../../components/Admin/CommonSpaceForButton";

const AdminDeviceListing: React.FC = () => {
  const location = useLocation();
  const pathName = location.pathname;
  console.log("pathname is", pathName);
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  console.log("search is ", search);
  const [devices, setDevices] = useState<DeviceData[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

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
    const fetchData = async () => {
      try {
        console.log("entered in the useEffect in the adminservice listing ");
        const result = await getAllDevices(search);
        console.log("result reached in the frontend", result);
        if (result?.data) {
          setDevices(result?.data?.data?.devices);
        }
      } catch (error) {
        console.log(error as Error);
      }
    };

    fetchData();
  }, [search]);

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
  const handleAddNewDevice = () => {
    console.log("button clicked");
    navigate("/admin/addNewDevice");
  };

  const buttonConfigs = [
    {
      label: "Add New Device",
      onClick: handleAddNewDevice,
      variant: "contained" as const,
      color: "primary" as const,
    },
  ];

  const navigationLink = "/admin/editDevice/";

  const filteredDevices = devices.filter((divice) =>
    divice.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-screen">
      <div className="mx-4">
        <TopBar
          pathName={pathName}
          heading="All Devices"
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>
      <div className="flex  justify-center my-5">
        <CommonButtonSpace
          buttons={buttonConfigs}
          alignment="right"
          className="mx-6"
        />
      </div>

      <div className="flex justify-center items-center mx-5 h-screen">
        <TableCommon
          columns={columns}
          data={filteredDevices}
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
