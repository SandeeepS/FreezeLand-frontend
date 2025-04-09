import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getAllServices } from "../../Api/admin";
import { listUnlistService } from "../../Api/admin";
import { deleteService } from "../../Api/admin";
import TableCommon from "../../components/Common/TableCommon";
import TopBar from "../../components/Admin/Dashboard/TopBar";
import { ServiceData } from "../../interfaces/IPages/Admin/IAdminInterfaces";
import { useSearchParams } from "react-router-dom";

const AdminServices: React.FC = () => {
  const location = useLocation();
  const pathName = location.pathname;
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  console.log("searldskfnldf",search);
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

  const [services, setServices] = useState<ServiceData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");


  const handleSearchChange = (query: string, results: any[] = []) => {
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
  const handleClick = () => {
    console.log("button clicked");
    navigate("/admin/addNewService");
  };

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
    <div className="flex flex-col h-screen">
      <div className="mb-5">
        <TopBar
          pathName={pathName}
          heading="Services"
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
        />{" "}
      </div>
      <div className="flex justify-end mx-10 my-5 ">
        <Button className="" onClick={handleClick} variant="contained">
          Add new Service
        </Button>
      </div>

      <div className="flex justify-center items-center mx-10  h-screen">
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
