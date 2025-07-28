const FallBackLoader = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-[9999] px-4">
      <div className="relative">
        <div className="h-10 w-10 md:h-12 md:w-12 lg:h-12 lg:w-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center"></div>
      </div>
   
    </div>
  );
};

export default FallBackLoader;
