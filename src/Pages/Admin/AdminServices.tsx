import React, { useEffect, useState } from "react";
import AdminHeader from "../../components/Admin/AdminHeader";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getAllServices } from "../../Api/admin";
import { listUnlistService } from "../../Api/admin";
import { deleteService } from "../../Api/admin";
import TableCommon from "../../components/Common/TableCommon";

interface ServiceData {
  _id: string;
  name: string;
  discription: string;
  status: boolean;
  isDeleted: boolean;
}

const AdminServices: React.FC = () => {
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
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("enterd in the useEffrect in the AdminSerivce listing ");
        const result = await getAllServices();
        console.log("result reached in the frontend is ", result);
        if (result?.data) {
          setServices(result?.data?.data?.services);
        }
      } catch (error) {
        console.log(error as Error);
      }
    };

    fetchData();
  }, []);
  const navigate = useNavigate();
  const heading = "Services";
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
  const navigationLink = '/admin/editService/';



  return (
    <div className=" flex flex-col">
      <div>
        <AdminHeader heading={heading} />
      </div>
      <div className="flex justify-end mx-10 my-5">
        <Button className="" onClick={handleClick} variant="contained">
          Add new Service
        </Button>
      </div>

      <div className="flex justify-center items-center mx-10 pt-7 h-screen">
        <TableCommon
          columns={columns}
          data={services}
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
