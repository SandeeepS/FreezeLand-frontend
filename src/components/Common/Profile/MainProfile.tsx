import React, { useEffect, useState } from "react";
import ProfileImage from "./ProfileImage";
import {
  IMainProfileDetails,
  MainProfileDetailsData,
} from "../../../interfaces/IComponents/Common/ICommonInterfaces";
import { useLoaderData } from "react-router-dom";

const MainProfile: React.FC<MainProfileDetailsData> = ({ role ,getImage}) => {
  const userData = useLoaderData() as IMainProfileDetails;
  console.log("user DAta a ", userData);
  const [details, setDetails] = useState<IMainProfileDetails>({
    name: "",
    phone: "",
    email: "",
    profile_picture: "",
  });
  const [image,setImage] = useState("");

  useEffect(() => {
    setDetails({
      name: userData.name || "",
      email: userData.email || "",
      phone: userData.phone || "",
      profile_picture: userData.profile_picture || "",
    });
  }, [userData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (details.profile_picture) {
          const result = await getImage(
            details.profile_picture,
            "service"
          );
          console.log("profile poicture is", result);
          if (result) {
            setImage(result.data.url);
          }
        }
      } catch (error) {
        console.log(error as Error);
      }
    };
    fetchData();
  }, [details]);

  return (
    <div>
      <h1 className="mt-60">This is Common profile section </h1>
      {/**make this component for both user, admin , mechanic and additon
       *  information should be added like a extrea component for each module */}
      <ProfileImage image={image} />
    </div>
  );
};

export default MainProfile;
