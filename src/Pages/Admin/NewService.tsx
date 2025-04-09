import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import AdminHeader from "../../components/Admin/AdminHeader";
import { ServiceListingValidation } from "../../components/Common/Validations";
import { addService, getS3SingUrl } from "../../Api/admin";
import { useNavigate } from "react-router-dom";
import LargeModal from "../../components/Common/LargeModal";
import { InewService } from "../../interfaces/IPages/Admin/IAdminInterfaces";



const NewService: React.FC = () => {
  const navigate = useNavigate();
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [image, setImage] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [modalImage, setModalImage] = useState<string | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>("");
  const [fileType, setFileType] = useState<string>("");
  // const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isFormDirty) {
        event.preventDefault();
        event.returnValue = ""; // Some browsers require this empty string for confirmation
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isFormDirty]);

  // const handleNavigationAttempt = () => {
  //   if (isFormDirty) {
  //     setShowConfirmation(true);
  //   }
  // };

  const handleSubmit = async (values: InewService) => {
    console.log("handlesubmit triggered");
    const response = await getS3SingUrl(fileName, fileType);
    if (response?.data.uploadURL) {
      const uploadResponse = await fetch(response.data.uploadURL, {
        method: "PUT",
        headers: {
          "Content-Type": fileType,
        },
        body: imageFile,
      });

      console.log("upload response is ", uploadResponse);
      values.imageKey = response.data.key;
      console.log("values for adding new Service is ", values);

      const result = await addService(values);
      if (result) {
        setIsFormDirty(false);
        navigate("/admin/services");
      }
    }
  };

  const onImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: any) => void
  ) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const fileLink = URL.createObjectURL(file);
      setFieldValue("image", file.name);
      setImageFile(file);
      setImage(fileLink);
      setFileName(file.name);
      setFileType(file.type);
    }
  };

  const handleCropComplete = (croppedImage: string) => {
    setImage(croppedImage);
  };

  const handleClickedImage = (image: string): void => {
    setModalImage(image);
    setIsModalOpen(!isModalOpen);
  };

  const closeModal = () => {
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
            discription: [],
            serviceCharge: 0,
            imageKey: "",
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
          }) => {
            const [newDescription, setNewDescription] = useState<string>("");

            const addDescription = () => {
              if (newDescription.trim()) {
                setFieldValue("discription", [
                  ...values.discription,
                  newDescription.trim(),
                ]);
                setNewDescription("");
              }
            };

            const removeDescription = (index: number) => {
              const updatedDescriptions = values.discription.filter(
                (_, i) => i !== index
              );
              setFieldValue("discription", updatedDescriptions);
            };

            return (
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

                {/* Service Name */}
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

                {/* Service Charge */}
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="serviceCharge"
                  >
                    Service Charge
                  </label>
                  <input
                    id="serviceCharge"
                    type="number"
                    value={values.serviceCharge}
                    onChange={(e) => {
                      handleChange(e);
                      setIsFormDirty(true);
                    }}
                    onBlur={handleBlur}
                    placeholder="Enter service charge"
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-500 ${
                      errors.serviceCharge && touched.serviceCharge
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.serviceCharge && touched.serviceCharge && (
                    <small className="text-red-500">
                      {errors.serviceCharge}
                    </small>
                  )}
                </div>

                {/* Description */}
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="discription"
                  >
                    Description
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      placeholder="Enter a description point"
                      className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={addDescription}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                      Add
                    </button>
                  </div>
                  {errors.discription && touched.discription && (
                    <small className="text-red-500">{errors.discription}</small>
                  )}
                  <ul className="mt-2">
                    {values.discription.map((desc, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-between bg-gray-100 p-2 rounded-md mb-2"
                      >
                        <span>{desc}</span>
                        <button
                          type="button"
                          onClick={() => removeDescription(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Upload Image */}
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="dropzone-file"
                >
                  Upload Image
                </label>
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="dropzone-file"
                    className="flex flex-col items-center justify-center w-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg
                        className="w-8 h-8 mb-4 text-gray-500"
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
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
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
                {errors.imageKey && touched.imageKey && (
                  <small className="text-red-500">{errors.imageKey}</small>
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

                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md shadow focus:outline-none focus:ring focus:ring-blue-300"
                  >
                    Submit
                  </button>
                </div>
              </form>
            );
          }}
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
      {/***
      <div>

        {showConfirmation && (
          <PageLeaveModal
            message="You have unsaved changes. Are you sure you want to leave?"
            onConfirm={() => handleConfirmLeave} 
            onCancel={() => handleCancelLeave} 
          />
        )}
      </div>
       */}
    </div>
  );
};

export default NewService;
