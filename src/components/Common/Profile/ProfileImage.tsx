import React, { useState } from "react";

interface ProfileImageProps {
  image?: string;
}

const ProfileImage: React.FC<ProfileImageProps> = ({ image }) => {
  const [imageError, setImageError] = useState(false);
 console.log("image is ",image)
  return (
    <div>
      <div className=" md:-top-10  p-1   ">
        <div className="w-36 h-36 md:w-48 md:h-48 ">
          <img
            src={
              imageError || !image
                ? "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"
                : image
            }
            alt="User profile"
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileImage;
