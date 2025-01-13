import React, { useEffect, useState } from "react";
import { Circle } from "lucide-react";
import { getAllRegisteredService } from "../../../Api/user";
import { Iconcern } from "../../../interfaces/Iconcern";

interface Project {
  name: string;
  logo: string;
  budget: string;
  status: "pending" | "completed" | "delayed" | "on schedule";
  team: string[];
  completion: number;
}

// Helper function to get status color
const getStatusColor = (status: Project["status"]): string => {
  switch (status) {
    case "pending":
      return "text-orange-500";
    case "completed":
      return "text-emerald-500";
    case "delayed":
      return "text-orange-500";
    case "on schedule":
      return "text-teal-500";
    default:
      return "text-gray-500";
  }
};

// Helper function to get progress bar colors
const getProgressColors = (status: Project["status"]) => {
  switch (status) {
    case "completed":
    case "on schedule":
      return {
        bg: "bg-emerald-200",
        bar: "bg-emerald-500",
      };
    case "delayed":
    case "pending":
      return {
        bg: "bg-red-200",
        bar: "bg-red-500",
      };
    default:
      return {
        bg: "bg-gray-200",
        bar: "bg-gray-500",
      };
  }
};

const Queue: React.FC = () => {
  const [allRegisteredServices, setAllRegisteredService] = useState<Iconcern>([]);
  //code to fetch the user registered complaints
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getAllRegisteredService();
        if (result) {
          setAllRegisteredService(result?.data?.allRegisteredUserServices);
          console.log(
            "result reached in the front , In queue component",
            allRegisteredServices
          );
        }
      } catch (error) {
        console.log(
          "Error occured while fetching the registered complaints form the queue component",
          error as Error
        );
      }
    };
    fetchData();
  }, []);
  // Sample data - replace with your actual data source
  const projects: Project[] = [
    {
      name: "Argon Design System",
      logo: "/api/placeholder/48/48",
      budget: "$2,500 USD",
      status: "pending",
      team: [
        "/api/placeholder/40/40",
        "/api/placeholder/40/40",
        "/api/placeholder/40/40",
        "/api/placeholder/40/40",
      ],
      completion: 60,
    },
    {
      name: "Angular Now UI Kit PRO",
      logo: "/api/placeholder/48/48",
      budget: "$1,800 USD",
      status: "completed",
      team: [
        "/api/placeholder/40/40",
        "/api/placeholder/40/40",
        "/api/placeholder/40/40",
        "/api/placeholder/40/40",
      ],
      completion: 100,
    },
    {
      name: "Angular Now UI Kit PRO",
      logo: "/api/placeholder/48/48",
      budget: "$1,800 USD",
      status: "completed",
      team: [
        "/api/placeholder/40/40",
        "/api/placeholder/40/40",
        "/api/placeholder/40/40",
        "/api/placeholder/40/40",
      ],
      completion: 100,
    },
    {
      name: "Angular Now UI Kit PRO",
      logo: "/api/placeholder/48/48",
      budget: "$1,800 USD",
      status: "completed",
      team: [
        "/api/placeholder/40/40",
        "/api/placeholder/40/40",
        "/api/placeholder/40/40",
        "/api/placeholder/40/40",
      ],
      completion: 100,
    },
    {
      name: "Angular Now UI Kit PRO",
      logo: "/api/placeholder/48/48",
      budget: "$1,800 USD",
      status: "completed",
      team: [
        "/api/placeholder/40/40",
        "/api/placeholder/40/40",
        "/api/placeholder/40/40",
        "/api/placeholder/40/40",
      ],
      completion: 100,
    },
    {
      name: "Angular Now UI Kit PRO",
      logo: "/api/placeholder/48/48",
      budget: "$1,800 USD",
      status: "completed",
      team: [
        "/api/placeholder/40/40",
        "/api/placeholder/40/40",
        "/api/placeholder/40/40",
        "/api/placeholder/40/40",
      ],
      completion: 100,
    },
    {
      name: "Angular Now UI Kit PRO",
      logo: "/api/placeholder/48/48",
      budget: "$1,800 USD",
      status: "completed",
      team: [
        "/api/placeholder/40/40",
        "/api/placeholder/40/40",
        "/api/placeholder/40/40",
        "/api/placeholder/40/40",
      ],
      completion: 100,
    },
    {
      name: "Angular Now UI Kit PRO",
      logo: "/api/placeholder/48/48",
      budget: "$1,800 USD",
      status: "completed",
      team: [
        "/api/placeholder/40/40",
        "/api/placeholder/40/40",
        "/api/placeholder/40/40",
        "/api/placeholder/40/40",
      ],
      completion: 100,
    },
    {
      name: "Angular Now UI Kit PRO",
      logo: "/api/placeholder/48/48",
      budget: "$1,800 USD",
      status: "completed",
      team: [
        "/api/placeholder/40/40",
        "/api/placeholder/40/40",
        "/api/placeholder/40/40",
        "/api/placeholder/40/40",
      ],
      completion: 100,
    },
    // Add more projects as needed
  ];

  return (
    <section className="relative py-16 bg-blueGray-50 mt-16">
      <div className="w-full mb-12 px-4">
        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white text-black">
          <div className="rounded-t mb-0 px-4 py-3 border-0">
            <div className="flex flex-wrap items-center">
              <div className="relative w-full px-1 max-w-full flex-grow flex-1 my-4">
                <h3 className="font-bold text-xl text-black">
                  Registered Services
                </h3>
              </div>
            </div>
          </div>

          <div className="block w-full overflow-x-auto">
            <table className="items-center w-full bg-transparent border-collapse">
              <thead>
                <tr>
                  {[
                    "Service",
                    "User Name",
                    "Status",
                    "Device Image",
                    "Completion status",
                    "",
                  ].map((header) => (
                    <th
                      key={header}
                      className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-gray-700 text-white "
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {projects.map((project, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-300 cursor-pointer hover:bg-gray-200 transition duration-200"
                  >
                    <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left flex items-center">
                      <img
                        src={project.logo}
                        className="h-12 w-12 bg-white rounded-full border"
                        alt={project.name}
                      />
                      <span className="ml-3 font-bold text-black">
                        {project.name}
                      </span>
                    </th>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      {project.budget}
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      <Circle
                        className={`${getStatusColor(
                          project.status
                        )} mr-2 h-4 w-4`}
                      />
                      {project.status}
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      <div className="flex">
                        {project.team.map((member, idx) => (
                          <img
                            key={idx}
                            src={member}
                            alt="team member"
                            className={`w-10 h-10 rounded-full border-2 border-blueGray-50 shadow ${
                              idx > 0 ? "-ml-4" : ""
                            }`}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      <div className="flex items-center">
                        <span className="mr-2">{project.completion}%</span>
                        <div className="relative w-full">
                          <div
                            className={`overflow-hidden h-2 text-xs flex rounded ${
                              getProgressColors(project.status).bg
                            }`}
                          >
                            <div
                              style={{ width: `${project.completion}%` }}
                              className={`shadow-none flex flex-col text-center whitespace-nowrap text-black justify-center ${
                                getProgressColors(project.status).bar
                              }`}
                            />
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-right">
                      <button className="text-blueGray-500 py-1 px-3">
                        <i className="fas fa-ellipsis-v"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Queue;
