import TableCommon from "../../components/Common/TableCommon";
import { blockMech, getAllMechanics } from "../../Api/admin";
import { useState } from "react";
import { useEffect } from "react";
import { deleteMech } from "../../Api/admin";
import TopBar from "../../components/Admin/Dashboard/TopBar";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { MechData } from "../../interfaces/IPages/Admin/IAdminInterfaces";
import CommonButtonSpace from "../../components/Admin/CommonSpaceForButton";

const AdminMechListing: React.FC = () => {
  const navigate = useNavigate();
  const columns = [
    { id: "name", label: "Name", minWidth: 170 },
    { id: "email", label: "Email", minWidth: 100 },
    {
      id: "isBlocked",
      label: "Status",
      minWidth: 170,
      align: "",
      format: (value: boolean) => (value ? "Blocked" : "Active"),
    },
    { id: "actions", label: "Actions", minWidth: 150, align: "" },
  ];
  const location = useLocation();
  const pathName = location.pathname;
  console.log("pathname is", pathName);
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  console.log('Search is ',search);
  const [mechs, setMech] = useState<MechData[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAllMechanics(search);
        console.log("Mech details in the first useEeffect");
        setMech(res?.data?.data?.mechs);
      } catch (error) {
        console.log(error as Error);
      }
    };
    fetchData();
  }, [search]);

  const updateMechStatus = (
    id: string,
    isBlocked: boolean,
    isDeleted: boolean
  ) => {
    setMech((prevMechs) =>
      isDeleted
        ? prevMechs.filter((mech) => mech._id !== id)
        : prevMechs.map((mech) =>
            mech._id === id ? { ...mech, isBlocked } : mech
          )
    );
  };

  const handleVerifyMechanic = () => {
    console.log("button clicked");
    navigate("/admin/verifyMechanic");
  };

  const buttonConfigs = [
    {
      label: "Verify Mechanic",
      onClick: handleVerifyMechanic,
      variant: "contained" as const,
      color: "primary" as const,
    },
    
  ];

  const filteredMechs = mechs.filter(
    (mech) =>
      mech.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mech.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-[695px]">
      <div className="mx-4">
        <TopBar
          pathName={pathName}
          heading="All Mechanics"
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

      <div className="flex   mx-5  h-screen">
        <TableCommon
          columns={columns}
          data={filteredMechs}
          updateStatus={updateMechStatus}
          blockUnblockFunciton={blockMech}
          deleteFunction={deleteMech}
        />
      </div>
    </div>
  );
};

export default AdminMechListing;
