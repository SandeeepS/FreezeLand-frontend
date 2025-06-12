import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import TopBar from "../../../components/Admin/Dashboard/TopBar";
import { getAllMechanics } from "../../../Api/admin";
import { MechData } from "../../../interfaces/IComponents/Admin/IAdminInterfaces";
import CommonTable3 from "../../../components/Common/CommonTable3";

const MechanicForVerificationList: React.FC = () => {
  const location = useLocation();
  const pathName = location.pathname;
  console.log("pathname is", pathName);
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  console.log("search is ", search);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [mechs, setMech] = useState<MechData[]>([]);
  const navigate = useNavigate();

  const columns = [
    { id: "name", label: "Name", minWidth: 170 },
    { id: "email", label: "Email", minWidth: 170 },
    // {
    //   id: "isBlocked",
    //   label: "Status",
    //   minWidth: 170,
    //   align: "right",
    //   format: (value: boolean) => (value ? "Blocked" : "Active"),
    // },
    { id: "actions", label: "Actions", minWidth: 150, align: "right" },
  ];
  const navigationLink = "/admin/VerfiyMechanic/";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAllMechanics(search);
        console.log("Mech Details ", res);
        setMech(res?.data?.data?.mechs);
      } catch (error) {
        console.log(error);
        throw new Error();
      }
    };
    fetchData();
  }, [search]);

  const filteredMechs = mechs
    .filter((mech) => !mech.isVerified)
    .filter(
      (mech) =>
        mech.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mech.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const handleViewMoreAboutMechanic = (id: string) => {
    navigate(`/admin/mechanic/details/${id}`);
  };

  return (
    <div className='flex flex-col h-screen"'>
      <div className="mx-4">
        <TopBar
          pathName={pathName}
          heading="Verify Mechanics"
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>

      <div className="flex  justify-center my-5">
        {/**Add future buttons here */}
        {/* <CommonButtonSpace
          buttons={buttonConfigs}
          alignment="right"
          className="mx-6"
        /> */}
      </div>

      <div className="flex justify-center items-center mx-5 h-screen">
        <CommonTable3
          columns={columns}
          data={filteredMechs.map(mech => ({
            _id: mech._id,
            name: mech.name,
            email: mech.email,
            // Add other fields if needed
          }))}
          navLink={navigationLink}
          handleViewMore={handleViewMoreAboutMechanic}
          role="admin"
        />
      </div>
    </div>
  );
};

export default MechanicForVerificationList;
