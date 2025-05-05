import BrandName from "./BrandName";

function Footer() {
  return (
    <div className="bg-[#078FDC] text-white">
      <div className="px-6 py-10 md:px-64">
        <div className="flex flex-col md:flex-row justify-between gap-10">
          {/* Brand and Address */}
          <div className="flex flex-col space-y-1 justify-start">
            <BrandName />
            <p>
              Unit no. B-303, Third floor, <br />
              Tower-B, Advant Navis Business Park, <br />
              Pathanamthitta, Ranni, <br />
              Sector 142, Kerala <br />
              201305
            </p>
            <div className="flex space-x-3 mt-2">
              <img src="/src/Images/facebookicon.png" alt="Facebook" className="w-6 h-6" />
              <img src="/src/Images/twitterIcon.png" alt="Twitter" className="w-6 h-6" />
              <img src="/src/Images/instagramIcon.png" alt="Instagram" className="w-6 h-6" />
              <img src="/src/Images/contact icon.png" alt="Contact" className="w-6 h-6" />
              <img src="/src/Images/youtube icon.png" alt="YouTube" className="w-6 h-6" />
            </div>
          </div>

          {/* Services */}
          <div className="flex flex-col space-y-3 mt-6 md:mt-0">
            <h2 className="font-semibold text-lg">SERVICE FOR</h2>
            <h4>Phone Repair</h4>
            <h4>Service Center</h4>
            <h4>Warranty Check</h4>
            <h4>Repair Status</h4>
          </div>

          {/* About */}
          <div className="flex flex-col space-y-3 mt-6 md:mt-0">
            <h2 className="font-semibold text-lg">ABOUT US</h2>
            <h4>Hotline: 18004190525</h4>
            <h4>WhatsApp: +91 97847 3645</h4>
            <h4>Email: freezeland@gmail.com</h4>
            <h4>Download App for Your Smartphone</h4>
          </div>
        </div>

        <hr className="my-8 border-gray-200" />

        <div className="text-center text-sm">
          <p>
            Privacy Policy | Terms of Use | Copyright © 2025 Freeze Land Inc. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Footer;
