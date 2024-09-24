import BrandName from "./BrandName";

function Footer() {
  return (
    <div className="bg-[#078FDC]">
      <div>
        <div className=" text-left ">
          <BrandName />
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

        <div></div>

        <div></div>
      </div>
    </div>
  );
}

export default Footer;
