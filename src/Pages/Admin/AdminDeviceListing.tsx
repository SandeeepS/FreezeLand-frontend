import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
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

  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || "";

  const [devices, setDevices] = useState<DeviceData[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState<number>(4);
  const [page, setPage] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const columns = [
    { id: "name", label: "Name", minWidth: 170 },
    {
      id: "isBlocked",
      label: "Status",
      minWidth: 170,
      format: (value: boolean) => (value ? "Blocked" : "Active"),
    },
    { id: "actions", label: "Actions", minWidth: 150 },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const result = await getAllDevices({
          page,
          limit: rowsPerPage,
          search: search,
        });

        if (result?.data) {
          setDevices(result.data.data.devices);
          setTotal(result.data.data.totalDevices);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, rowsPerPage, search]);

  const updateDeviceStatus = (
    id: string,
    isBlocked: boolean,
    isDeleted: boolean
  ) => {
    setDevices((prevDevice) =>
      isDeleted
        ? prevDevice.filter((d) => d._id !== id)
        : prevDevice.map((d) => (d._id === id ? { ...d, isBlocked } : d))
    );
  };

  const navigate = useNavigate();

  const buttonConfigs = [
    {
      label: "Add New Device",
      onClick: () => navigate("/admin/addNewDevice"),
      variant: "contained" as const,
      color: "primary" as const,
    },
  ];

  return (
    <div className="flex flex-col h-screen overflow-hidden ">
      <div className="mx-4 flex-shrink-0">
        <TopBar
          pathName={pathName}
          heading="All Devices"
          searchQuery={search}
          onSearchChange={() => {
            setPage(0);
          }}
        />
      </div>

      <div className="flex justify-center my-5 flex-shrink-0">
        <CommonButtonSpace
          buttons={buttonConfigs}
          alignment="right"
          className="mx-6"
        />
      </div>

      <div className="flex-1 mx-5 mb-5 overflow-hidden">
        <TableCommon
          columns={columns}
          data={devices}
          updateStatus={updateDeviceStatus}
          blockUnblockFunciton={listUnlistDevices}
          deleteFunction={deleteDevice}
          serverSide={{
            page,
            rowsPerPage,
            total,
            loading,
            onPageChange: (newPage: number) => setPage(newPage),
            onRowsPerPageChange: (newLimit: number) => {
              setRowsPerPage(newLimit);
              setPage(0);
            },
          }}
          navLink="/admin/editDevice/"
        />
      </div>
    </div>
  );
};

export default AdminDeviceListing;
