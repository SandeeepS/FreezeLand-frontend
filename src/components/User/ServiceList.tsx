function ServiceList() {
  return (
    <div className="w-full bg-white h-[600px]">
      <h1 className="text-5xl m-12">OUR SERVICES</h1>
      <div className="flex m-12 space-x-10">
        {/* {div 1} */}
        <div className="max-w-xs h-64 rounded overflow-hidden shadow-lg bg-[#078FDC]">
          <img
            className="w-full"
            src="/src/Images/AC service.jpg"
            alt="Sunset in the mountains"
          />
          <div className="flex items-center justify-center mt-2">
            <h3 className=" text-xl mb-2 text-center">A/C Service</h3>
          </div>
        </div>
        {/* {div 2} */}

        {/* {div 1} */}
        <div className="max-w-xs h-64 rounded overflow-hidden shadow-lg bg-[#078FDC]">
          <img
            className="w-full"
            src="/src/Images/washingmachine2.jpg"
            alt="Sunset in the mountains"
          />
          <div className="flex items-center justify-center mt-2">
            <h3 className=" text-xl mb-2 text-center">WashingMachine</h3>
          </div>
        </div>
        {/* {div 2} */}

        {/* {div 3} */}
        <div className="max-w-xs h-64 rounded overflow-hidden shadow-lg bg-[#078FDC]">
          <img
            className="w-full"
            src="/src/Images/fridge-repair.jpg"
            alt="Sunset in the mountains"
          />
          <div className="flex items-center justify-center mt-2">
            <h3 className="text-xl mb-2 text-center">FridgeRepaire</h3>
          </div>
        </div>
        {/* {div 3} */}

        {/* {div 4} */}
        <div className="max-w-xs h-64 rounded overflow-hidden shadow-lg bg-[#078FDC]">
          <img
            className="w-full"
            src="/src/Images/ac installation.jpg"
            alt="Sunset in the mountains"
          />
          <div className="flex items-center justify-center mt-2">
            <h3 className="text-xl mb-2 text-center">A/C Intallation</h3>
          </div>
        </div>
        {/* {div 4} */}
      </div>
    </div>
  );
}

export default ServiceList;
