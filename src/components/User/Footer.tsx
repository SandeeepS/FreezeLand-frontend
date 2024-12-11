import BrandName from "./BrandName";

function Footer() {
  return (
    <div className="bg-[#078FDC]">
      <div className="flex-col">
        <div className="flex   pb-0 justify-between md:px-64">
          <div className="brand&comp_details  text-left flex-col  ">
            <div className="">
              <BrandName />
            </div>
            <p>
              Unit no. B-303, Third floor, <br /> Tower-B, Advant Navis <br />{" "}
              Business Park, <br /> Pathanamthitta ,Ranni,
              <br /> Sector 142, Kerala <br /> 201305
            </p>
            <div className="flex w-7 h-7 mx-1 space-x-2 ">
              <img src="/src/Images/facebookicon.png" alt="" />
              <img src="/src/Images/twitterIcon.png" alt="" />
              <img src="/src/Images/instagramIcon.png" alt="" />
              <img src="/src/Images/contact icon.png" alt="" />
              <img src="/src/Images/youtube icon.png" alt="" />
            </div>
          </div>

          <div className="Service mt-24">
            <div>
              <h2 className="text-white">SERVICE FOR</h2>
            </div>

            <div className="my-3">
              <h4>Phone Repair</h4>
              <h4>Service Center</h4>
              <h4>Warrenty Check</h4>
              <h4>Repair Status</h4>
            </div>
          </div>

          <div className="Service mt-24">
            <div>
              <h2 className="text-white">ABOUT US</h2>
            </div>

            <div className="my-3">
              <h4>Hotline : 18004190525</h4>
              <h4>WhatsApp : +91978473645</h4>
              <h4>Email : freezeland@gmail.com</h4>
              <h4>Download App For Your</h4>
              <h4>Smartphone</h4>
            </div>
          </div>
        </div>
      </div>
      <div className="px-12 md:px-64">
        <hr className="w-full h-1 mx-auto my-4 mb-0  bg-gray-100 border-0 rounded md:my-10  md:mb-0" />
      </div>

      <div className="px-12 md:px-64">
        <h4>
          Privacry Policy | Terms of Use | Copyright @ 2025 Freeze Land Inc. All
          rights Reserved.
        </h4>
      </div>
    </div>
  );
}

export default Footer;
