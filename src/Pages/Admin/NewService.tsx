import React, { useState, useEffect } from "react";
import imageCompression from "browser-image-compression";

import { Formik } from "formik";
import AdminHeader from "../../components/Admin/AdminHeader";
import { ServiceListingValidation } from "../../components/Common/Validations";
import { addService } from "../../Api/admin";
import { useNavigate } from "react-router-dom";
import LargeModal from "../../components/Common/LargeModal";
import { FormikHelpers } from "formik";

export interface InewService {
  name: string;
  discription: string;
  image: string;
}

const NewService: React.FC = () => {
  const navigate = useNavigate();
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [image, setImage] = useState<string>("");
  const [modalImage, setModalImage] = useState<string | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const compressImage = async (image:File) => {
    const options = {
      maxSizeMB: 0.4 , // Limit file size to 1MB
      maxWidthOrHeight: 800,
      useWebWorker: true, // Limit resolution
    };
    try {
      const compressedFile = await imageCompression(image, options);
      return compressedFile;
    } catch (error) {
      console.error("Error during image compression", error);
    }
  };

  async function convertBlobToBase64(blobUrl: string | Blob) : Promise<string>{
    let blob: Blob;

    if (typeof blobUrl === "string") {
      // If blobUrl is a URL, fetch the blob
      blob = await fetch(blobUrl).then((response) => response.blob());
    } else {
      // If blobUrl is already a Blob/File, use it directly
      blob = blobUrl;
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob); // This will give you base64 encoded image
    });
  }


  const handleSubmit = async (values: InewService) => {
    //craeting a change to pass the raw image to the backend 
    const blob = await fetch(image).then((res) => res.blob());
    const file = new File([blob], "image.jpg", { type: blob.type });


    const compressedImage = await compressImage(file)

    if (!compressedImage) {
      console.error("Compression failed");
      return; // Stop further execution
    }

    const base64Image = await convertBlobToBase64(URL.createObjectURL(compressedImage));
    values.image = base64Image;
   
    console.log("values for adding new Service is ", values);
    const result = await addService(values);
    if (result) {
      setIsFormDirty(false);
      navigate("/admin/services");
    }
  };

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isFormDirty) {
        event.preventDefault();
        event.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isFormDirty]);

  const onImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: FormikHelpers<InewService>["setFieldValue"]
  ) => {
    if (event.target.files && event.target.files[0]) {
      const newImage = URL.createObjectURL(event.target.files[0]);
      setFieldValue("image", newImage);
      setImage(""); // Clear previous image
      setTimeout(() => setImage(newImage), 0); // Update with new image
    }
  };

  const handleCropComplete = (croppedImage: string) => {
    setImage(croppedImage); // Set the cropped image
  };

  const handleClickedImage = (image: string): void => {
    console.log("image clicked ");
    setModalImage(image);
    setIsModalOpen(!isModalOpen);
  };

  const closeModal = () => {
    console.log("closed the modal");
    setIsModalOpen(false);
    setModalImage(undefined);
  };

  return (
    <div>
      <AdminHeader heading="Adding New Service" />
      <div className="flex justify-center items-center py-10 h-screen">
        <Formik
          initialValues={{
            name: "",
            discription: "",
            image: "",
          }}
          validationSchema={ServiceListingValidation}
          onSubmit={handleSubmit}
        >
          {({
            handleSubmit,
            handleChange,
            handleBlur,
            values,
            errors,
            touched,
            setFieldValue,
          }) => (
            <form
              className="bg-white shadow-md rounded-lg p-8 w-full max-w-4xl"
              onSubmit={(e) => {
                setIsFormDirty(false);
                handleSubmit(e);
              }}
              onChange={() => setIsFormDirty(true)}
            >
              <h2 className="text-2xl font-bold text-center mb-6">
                New Service
              </h2>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="name"
                >
                  Service Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={values.name}
                  onChange={(e) => {
                    handleChange(e);
                    setIsFormDirty(true);
                  }}
                  onBlur={handleBlur}
                  placeholder="Enter service name"
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-500 ${
                    errors.name && touched.name
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {errors.name && touched.name && (
                  <small className="text-red-500">{errors.name}</small>
                )}
              </div>

              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="discription"
              >
                Upload Image
              </label>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="dropzone-file"
                  className="flex flex-col items-center justify-center w-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-500 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 16"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                      />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      SVG, PNG, JPG or GIF (MAX. 800x400px)
                    </p>
                  </div>
                  <input
                    id="dropzone-file"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => onImageChange(e, setFieldValue)}
                  />
                </label>
              </div>
              {errors.image && touched.image && (
                <small className="text-red-500">{errors.image}</small>
              )}
              {image && (
                <div
                  className="w-48 h-48 p-5 cursor-pointer"
                  onClick={() => handleClickedImage(image)}
                >
                  <img
                    src={image}
                    alt="Selected"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="discription"
                >
                  Description
                </label>
                <textarea
                  id="discription"
                  value={values.discription}
                  onChange={(e) => {
                    handleChange(e);
                    setIsFormDirty(true);
                  }}
                  onBlur={handleBlur}
                  placeholder="Enter a brief description of the service"
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-500 ${
                    errors.discription && touched.discription
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  rows={4}
                ></textarea>
                {errors.discription && touched.discription && (
                  <small className="text-red-500">{errors.discription}</small>
                )}
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md shadow focus:outline-none focus:ring focus:ring-blue-300"
                >
                  Submit
                </button>
              </div>
            </form>
          )}
        </Formik>
      </div>

      {/* Modal for displaying the image */}
      {isModalOpen && modalImage && (
        <div>
          <LargeModal
            image={modalImage}
            isOpen={isModalOpen}
            onClose={closeModal}
            onCropedImageBack={handleCropComplete}
          />
        </div>
      )}
    </div>
  );
};

export default NewService;
