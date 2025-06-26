import BrandName from "./BrandName";

function Footer() {
  return (
    <div className="bg-[#078FDC] text-white">
      <div className="px-4 sm:px-6 md:px-12 lg:px-24 xl:px-64 py-8 sm:py-10">
        <div className="flex flex-col lg:flex-row justify-between gap-6 sm:gap-8 lg:gap-10">
          <div className="flex flex-col space-y-3 justify-start max-w-sm">
            <BrandName />
            <p className="text-sm sm:text-base leading-relaxed">
              Unit no. B-303, Third floor, <br />
              Tower-B, Advant Navis Business Park, <br />
              Pathanamthitta, Ranni, <br />
              Sector 142, Kerala <br />
              201305
            </p>

            {/* Social Media Icons */}
            <div className="flex space-x-3 mt-4">
              <img
                src="/Images/facebookicon.png"
                alt="Facebook"
                className="w-5 h-5 sm:w-6 sm:h-6 hover:opacity-80 cursor-pointer transition-opacity"
              />
              <img
                src="/Images/twitterIcon.png"
                alt="Twitter"
                className="w-5 h-5 sm:w-6 sm:h-6 hover:opacity-80 cursor-pointer transition-opacity"
              />
              <img
                src="/Images/instagramIcon.png"
                alt="Instagram"
                className="w-5 h-5 sm:w-6 sm:h-6 hover:opacity-80 cursor-pointer transition-opacity"
              />
              <img
                src="/Images/contact icon.png"
                alt="Contact"
                className="w-5 h-5 sm:w-6 sm:h-6 hover:opacity-80 cursor-pointer transition-opacity"
              />
              <img
                src="/Images/youtube icon.png"
                alt="YouTube"
                className="w-5 h-5 sm:w-6 sm:h-6 hover:opacity-80 cursor-pointer transition-opacity"
              />
            </div>
          </div>

          <div className="flex flex-col space-y-3">
            <h2 className="font-semibold text-base sm:text-lg">SERVICE FOR</h2>
            <div className="space-y-2">
              <h4 className="text-sm sm:text-base hover:text-gray-200 cursor-pointer transition-colors">
                Phone Repair
              </h4>
              <h4 className="text-sm sm:text-base hover:text-gray-200 cursor-pointer transition-colors">
                Service Center
              </h4>
              <h4 className="text-sm sm:text-base hover:text-gray-200 cursor-pointer transition-colors">
                Warranty Check
              </h4>
              <h4 className="text-sm sm:text-base hover:text-gray-200 cursor-pointer transition-colors">
                Repair Status
              </h4>
            </div>
          </div>

          <div className="flex flex-col space-y-3">
            <h2 className="font-semibold text-base sm:text-lg">ABOUT US</h2>
            <div className="space-y-2">
              <h4 className="text-sm sm:text-base">
                <span className="font-medium">Hotline:</span> 18004190525
              </h4>
              <h4 className="text-sm sm:text-base">
                <span className="font-medium">WhatsApp:</span> +91 97847 3645
              </h4>
              <h4 className="text-sm sm:text-base">
                <span className="font-medium">Email:</span> freezeland@gmail.com
              </h4>
              <h4 className="text-sm sm:text-base">
                Download App for Your Smartphone
              </h4>
            </div>
          </div>
        </div>

        <hr className="my-6 sm:my-8 border-gray-200 opacity-30" />

        <div className="text-center text-xs sm:text-sm">
          <p className="leading-relaxed">
            <span className="inline-block mb-1 sm:mb-0">
              Privacy Policy | Terms of Use |{" "}
            </span>
            <span>Copyright © 2025 Freeze Land Inc. All rights reserved.</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Footer;
