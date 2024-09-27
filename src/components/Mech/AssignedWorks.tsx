import React from "react";
const AssignedWorks: React.FC = () => {
  return (
    <div className="w-full bg-white h-[600px]  ">
      <h1 className="text-5xl text-center m-12">Assigned Works</h1>
      <div className="flex m-12 space-x-10 flex justify-center">
        {/* {div 1} */}
        <div className="h-64 flex flex-col justify-between rounded overflow-hidden shadow-lg bg-[#fefefe]">
          <div className="w-full flex-grow flex justify-center items-center p-2">
            <img
              className="w-24 h-24 object-contain" // Adjust the size here
              src="/src/Images/air-conditioning.png"
              alt="A/C Service"
            />
          </div>

          <div className="flex justify-center p-4">
            <h3 className="text-xl mb-2 text-center">A/C Service</h3>
          </div>
        </div>

        {/* {div 2} */}

        {/* {div 1} */}
        <div className="h-64 flex flex-col justify-between rounded overflow-hidden shadow-lg bg-[#fefefe]">
          <div className="w-full flex-grow flex justify-center items-center p-2">
            <img
              className="w-24 h-24 object-contain" // Adjust the size here
              src="/src/Images/washing-machine.png"
              alt="A/C Service"
            />
          </div>

          <div className="flex justify-center p-4">
            <h3 className="text-xl mb-2 text-center">Washing Machine</h3>
          </div>
        </div>
        {/* {div 2} */}

        {/* {div 3} */}
        <div className="h-64 flex flex-col justify-between rounded overflow-hidden shadow-lg bg-[#fefefe]">
          <div className="w-full flex-grow flex justify-center items-center p-2">
            <img
              className="w-24 h-24 object-contain" // Adjust the size here
              src="/src/Images/fridge.png"
              alt="A/C Service"
            />
          </div>

          <div className="flex justify-center p-4">
            <h3 className="text-xl mb-2 text-center">Fridge Repaire</h3>
          </div>
        </div>
        {/* {div 3} */}

        {/* {div 4} */}
        <div className="h-64 flex flex-col justify-between rounded overflow-hidden shadow-lg bg-[#fefefe]">
          <div className="w-full flex-grow flex justify-center items-center p-2">
            <img
              className="w-24 h-24 object-contain" // Adjust the size here
              src="/src/Images/air-conditioning.png"
              alt="A/C Service"
            />
          </div>

          <div className="flex justify-center p-4">
            <h3 className="text-xl mb-2 text-center">A/C Installation</h3>
          </div>
        </div>
        {/* {div 4} */}
      </div>
    </div>
  );
};

export default AssignedWorks;
