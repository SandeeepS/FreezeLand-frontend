import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAllServices } from "../../Api/admin";
import { listUnlistService } from "../../Api/admin";
import { deleteService } from "../../Api/admin";
import TableCommon from "../../components/Common/TableCommon";
import TopBar from "../../components/Admin/Dashboard/TopBar";
import { ServiceData } from "../../interfaces/IPages/Admin/IAdminInterfaces";
import { useSearchParams } from "react-router-dom";
import CommonButtonSpace from "../../components/Admin/CommonSpaceForButton";

const AdminServices: React.FC = () => {
  const location = useLocation();
  const pathName = location.pathname;
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  console.log("searldskfnldf", search);
  const columns = [
    { id: "name", label: "Name", minWidth: 170 },
    {
      id: "isBlocked",
      label: "Status",
      minWidth: 170,
      align: "",
      format: (value: boolean) => (value ? "Blocked" : "Active"),
    },
    { id: "actions", label: "Actions", minWidth: 150, align: "" },
  ];

  const [services, setServices] = useState<ServiceData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("enterd in the useEffrect in the AdminSerivce listing ");
        const result = await getAllServices(search);
        console.log("result reached in the frontend is ", result);
        if (result?.data) {
          setServices(result?.data?.data?.services);
        }
      } catch (error) {
        console.log(error as Error);
      }
    };

    fetchData();
  }, [search]);
  const navigate = useNavigate();
  const handleAddNewService = () => {
    console.log("button clicked");
    navigate("/admin/addNewService");
  };

  const buttonConfigs = [
    {
      label: "Add New Service",
      onClick: handleAddNewService,
      variant: "contained" as const,
      color: "primary" as const,
    },
  ];

  const updateServiceStatus = (
    id: string,
    isBlocked: boolean,
    isDeleted: boolean
  ) => {
    setServices((prevservice) =>
      isDeleted
        ? prevservice.filter((services) => services._id !== id)
        : prevservice.map((services) =>
            services._id === id ? { ...services, isBlocked } : services
          )
    );
  };
  const navigationLink = "/admin/editService/";

  const filteredService = services.filter((serivce) =>
    serivce.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-[695px]">
      <div className=" mx-4">
        <TopBar
          pathName={pathName}
          heading="Services"
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
        />{" "}
      </div>

      <div className="flex  justify-center my-5">
        <CommonButtonSpace
          buttons={buttonConfigs}
          alignment="right"
          className="mx-6"
        />
      </div>

      <div className="flex  mx-5 h-screen">
        <TableCommon
          columns={columns}
          data={filteredService}
          updateStatus={updateServiceStatus}
          blockUnblockFunciton={listUnlistService}
          deleteFunction={deleteService}
          navLink={navigationLink}
        />
      </div>
    </div>
  );
};

export default AdminServices;
