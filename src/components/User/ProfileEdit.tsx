import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../../App/store'; // Assuming this is your Redux selector
import axios from 'axios';

interface UserProfile {
  name: string;
  phone: string;
  email: string;
  imageUrl: string;
}

const ProfileEdit: React.FC = () => {
  const { userData } = useAppSelector((state) => state.auth); 
  console.log("user data is ",userData)// Assuming this holds auth data
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: '',
    phone: '',
    email: '',
    imageUrl: 'https://via.placeholder.com/150',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get('/api/users/me'); // API call to fetch logged-in user's details
        const user = response.data;
        setUserProfile({
          name: user.name || '',
          phone: user.phone || '',
          email: user.email || '',
          imageUrl: user.imageUrl || 'https://via.placeholder.com/150',
        });
      } catch (error) {
        console.error("Failed to fetch user details", error);
      }
    };

    fetchUserDetails();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserProfile({
      ...userProfile,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserProfile({ ...userProfile, imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setUserProfile({ ...userProfile, imageUrl: 'https://via.placeholder.com/150' });
    setImageFile(null);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append('name', userProfile.name);
      formData.append('phone', userProfile.phone);
      if (imageFile) formData.append('image', imageFile);

      await axios.put('/api/users/me', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('Changes saved successfully!');
    } catch (error) {
      console.error('Failed to save changes', error);
      alert('Failed to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-8 shadow-md rounded-lg border border-gray-200">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Edit Profile</h2>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-shrink-0 flex flex-col items-center">
          <img
            className="w-32 h-32 rounded-full object-cover border-2 border-blue-500"
            src={userProfile.imageUrl}
            alt="Profile"
          />
          <p className="mt-4 text-gray-600 font-semibold text-lg">Email: {userProfile.email}</p>

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-4 border border-gray-300 rounded-md p-2 w-full"
          />
          <button
            onClick={handleRemovePhoto}
            className="mt-2 text-red-600 hover:underline"
            disabled={!imageFile}
          >
            Remove Photo
          </button>
        </div>

        <div className="flex-grow">
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={userProfile.name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              placeholder="Enter your name"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="phone">Phone Number</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={userProfile.phone}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              placeholder="Enter your phone number"
            />
          </div>

          <button
            onClick={handleSave}
            className={`mt-4 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none ${
              isSaving ? 'cursor-not-allowed opacity-50' : ''
            }`}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileEdit;
