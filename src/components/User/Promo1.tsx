function Promo1() {
  return (
    <>
      <div className="bg-slate-100  w-full h-[400px] flex ">
        <div className="flex-grow">
          <div className="pl-12 pt-20">
            <h1 className="text-5xl">
              YOUR
              <span className="text-freeze-color font-Metal italic">
                DREAMS
              </span>
            </h1>
            <h1 className="text-5xl">
              OUR
              <span className="text-freeze-color font-Metal italic">
                EXPERTISE
              </span>
            </h1>
          </div>
          <div className="pt-12 pl-12">
            <h6>
              in the Montreal area, we provide a full-service interior <br></br>{" "}
              design and turnkey renovation solution. We handle every <br></br>{" "}
              stage, from initial design to final completion, ensuring the{" "}
              <br></br> creation of harmonious and functional interiors.
            </h6>
          </div>
        </div>

        <div className="smallPictureBox justify-end items-center  ">
          {/* <div className="washingMachineBox ml-28 bg-freeze-color w-[400px]  h-[290px]  mr-10 mt-10">
            <div className="p-8">
              <img src="/src/Images/wahsingmachine.jpg" alt="" />
            </div>
          </div> */}
          <div className="fridgeBox ml-28 bg-freeze-color w-[450px]  h-[320px]  mr-10 mt-10">
            <div className="p-8">
              <img src="/src/Images/fridge2.jpg" alt="" />
            </div>
          </div>
          
        </div>
      </div>
    </>
  );
}

export default Promo1;
