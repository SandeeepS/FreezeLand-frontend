import React, { useState } from "react";

interface ProfileImageProps {
  image?: string;
}

const ProfileImage: React.FC<ProfileImageProps> = ({ image }) => {
  const [imageError, setImageError] = useState(false);
 console.log("image is ",image)
  return (
    <div>
      <div className="absolute -top-16 md:relative md:-top-10 bg-white p-1 shadow-lg border-4 border-white">
        <div className="w-28 h-28 md:w-32 md:h-32  overflow-hidden">
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
