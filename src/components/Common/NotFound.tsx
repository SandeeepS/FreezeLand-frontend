import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  const handleResponse = () => {
       navigate('user/homepage')
  }
  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col items-center justify-center h-full">
        <div className="w-full md:w-[80%] lg:w-[60%] xl:w-[50%] mb-8">
          <DotLottieReact
            src="https://lottie.host/bdd92b5f-659d-4109-84b0-0e6c86edec89/kUL5A7BqmE.lottie"
            loop
            autoplay
          />
        </div>
        <div className="flex justify-center w-full md:w-[40%] lg:w-[30%] xl:w-[25%] ">
          <button 
            type="button" 
            onClick={handleResponse}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-8 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            Go back to home  page 
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
