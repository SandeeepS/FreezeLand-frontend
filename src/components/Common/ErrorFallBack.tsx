import { DotLottieReact } from "@lottiefiles/dotlottie-react";
interface ErrorFallbackProps {
    error: unknown;
    resetErrorBoundary: () => void;
  }

  const ErrorFallBack: React.FC<ErrorFallbackProps> =  ({ error, resetErrorBoundary }) => {
  console.log("Error occured ", error);
  return (
    <div>
        <div>
        <DotLottieReact
        src="https://lottie.host/ddaa5cc0-be5f-4d16-a4fc-2f16ec040185/YLpCmGOPCj.lottie"
        loop
        autoplay
      />
        </div>
        <div>
        <button 
            type="button" 
            onClick={resetErrorBoundary}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-8 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            Refresh the page 
          </button>
        </div>
  
    </div>
  );
};

export default ErrorFallBack;
