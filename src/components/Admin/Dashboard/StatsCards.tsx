import { useEffect, useState } from "react";
import toast from "react-hot-toast";
// import { FiTrendingDown, FiTrendingUp } from "react-icons/fi";
import { getAllMechanics, getAllServices, getAllUsers } from "../../../Api/admin";
const StatsCards = () => {

  const [userCount , setUserCount ] = useState<number>(0);
  const [mechCount , setMechCount ] = useState<number>(0);
  const [serviceCount , setServiceCount ] = useState<number>(0);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const userDetails = await getAllUsers("");
        const mechDetails = await getAllMechanics("");
        const serviceDetails = await getAllServices("");

        setUserCount(userDetails?.data?.data?.users.length || 0);
        setMechCount(mechDetails?.data?.data?.mechs.length || 0);
        setServiceCount(serviceDetails?.data?.data?.services.length || 0);
      } catch (error) {
        toast.error("Error occurred while fetching the details");
        console.log("Error occurred while fetching the details", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    console.log("userCount is",userCount);
    console.log("mechCount is",mechCount);
    console.log("service",serviceCount);
  })

  return (
    <>
      <Card
        title="Total No of Users"
        value={userCount}
        // pillText="2.75%"
        // trend="up"
        // period="From Jan 1st - Jul 31st"
      />
      <Card
        title="Total No of Mechanics"
        value={mechCount}
        // pillText="1.01%"
        // trend="down"
        // period="From Jan 1st - Jul 31st"
      />
      <Card
        title="Total No of Services"
        value={serviceCount}
        // pillText="60.75%"
        // trend="up"
        // period="Previous 365 days"
      />
    </>
  );
};

export default StatsCards;

const Card = ({
  title,
  value,
  period,
}: {
  title: string;
  value: number;
  pillText?: string;
  trend?: "up" | "down";
  period?: string;
}) => {
  return (
    <div className="col-span-4 p-4 rounded border  bg-white">
      <div className="flex mb-8 items-start justify-between">
        <div>
          <h3 className="text-black mb-2 text-sm">{title}</h3>
          <p className="text-3xl font-semibold">{value}</p>
        </div>

        {/**use the below trend symbol for future use  */}
        {/* <span
          className={`text-xs flex items-center gap-1 font-medium px-2 py-1 rounded ${
            trend === "up"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {trend === "up" ? <FiTrendingUp /> : <FiTrendingDown />} {pillText}
        </span> */}
      </div>

      <p className="text-xs text-stone-500">{period}</p>
    </div>
  );
};
