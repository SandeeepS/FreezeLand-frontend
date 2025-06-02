import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const NotFound = () => {
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
      </div>
    </div>
  );
};

export default NotFound;
