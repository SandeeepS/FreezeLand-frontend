import React, { useState, useEffect } from "react";

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const InstallPWA: React.FC = () => {
  const [supportsPWA, setSupportsPWA] = useState(false);
  const [promptInstall, setPromptInstall] = useState<InstallPromptEvent | null>(
    null
  );
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setPromptInstall(e as InstallPromptEvent);
      setSupportsPWA(true);
      setShowModal(true); 
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Detect if app is already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setSupportsPWA(false);
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallClick = async () => {
    if (!promptInstall) return;

    promptInstall.prompt();
    const { outcome } = await promptInstall.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);

    setPromptInstall(null);
    setShowModal(false);
  };

  const handleDismiss = () => {
    setShowModal(false);
  };

  if (!supportsPWA || !showModal) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex top-0 left-0 justify-center items-start bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-sm text-center">
        <h2 className="text-xl font-semibold mb-3">Install Our App</h2>
        <p className="text-sm text-gray-600 mb-6">
          Get faster access and a better experience by installing our app on
          your device.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={handleInstallClick}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Install
          </button>
          <button
            onClick={handleDismiss}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallPWA;
