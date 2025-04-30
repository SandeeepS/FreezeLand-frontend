import React from "react";
import { useState } from "react";
import { Slider } from "@mui/material";
import Cropper from "react-easy-crop";
import { Point, Area } from "react-easy-crop";

interface ModalProps {
  image: string;
  isOpen: boolean;
  onClose: () => void;
  onCropedImageBack:(croppedImage:string) => void;
}

const LargeModal: React.FC<ModalProps> = ({ image, isOpen, onClose,onCropedImageBack }) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleSetCrop = () => {
    if (croppedAreaPixels) {
      // Convert cropped image to blob
      const imageCanvas = document.createElement("canvas");
      imageCanvas.width = croppedAreaPixels.width;
      imageCanvas.height = croppedAreaPixels.height;
      const ctx = imageCanvas.getContext("2d");
      const img = new Image();

      img.src = image; // original image
      img.onload = () => {
        ctx?.drawImage(
          img,
          croppedAreaPixels.x,
          croppedAreaPixels.y,
          croppedAreaPixels.width,
          croppedAreaPixels.height,
          0,
          0,
          croppedAreaPixels.width,
          croppedAreaPixels.height
        );

        // Convert canvas to base64 image
        const croppedImage = imageCanvas.toDataURL("image/jpeg");
        console.log("cropped image is ",croppedImage)
        onCropedImageBack(croppedImage); // Pass cropped image back to parent
      };

      onClose(); // Close modal after setting the cropped image
    }
  };

  return (
    <div
      id="large-modal"
      tabIndex={-1}
      className={`fixed top-0 flex justify-around h-full mt-32 ml-12 right-0 z-50 ${
        isOpen ? "block" : "hidden"
      } w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full`}
    >
      <div className="relative w-full max-w-4xl ">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 ">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Crop Image
            </h3>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={onClose}
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          <div className="p-4 md:p-5 space-y-4 h-48 relative ">
            <div className="App">
              <div className="crop-container h-48">
                <Cropper
                  image={image}
                  crop={crop}
                  zoom={zoom}
                  aspect={4 / 3}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                />
              </div>
              <div className="controls">
                <Slider
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  aria-labelledby="Zoom"
                  onChange={(e, zoom) => setZoom(Number(zoom))}
                  classes={{ root: "slider" }}
                />
              </div>
            </div>
          </div>
          <div className="flex items-center p-4 md:p-5 space-x-3 rtl:space-x-reverse border-t border-gray-200 rounded-b dark:border-gray-600">
            <button
              type="button"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              onClick={handleSetCrop}
            >
              Set
            </button>
            <button
              type="button"
              className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LargeModal;
