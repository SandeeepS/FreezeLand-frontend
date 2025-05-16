import React, { useState, useEffect } from 'react';

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}


const InstallPWA: React.FC = () => {
  const [supportsPWA, setSupportsPWA] = useState(false);
  const [promptInstall, setPromptInstall] = useState<InstallPromptEvent | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      // Store the install prompt for later use
      setPromptInstall(e as InstallPromptEvent);
      setSupportsPWA(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Check if the app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setSupportsPWA(false); // Already installed, don't show button
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleClick = async () => {
    if (!promptInstall) {
      return;
    }
    // Show the prompt
    promptInstall.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await promptInstall.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    
    // We no longer need the prompt. Clear it
    setPromptInstall(null);
  };

  if (!supportsPWA) {
    return null;
  }

  return (
    <button
      className="install-button"
      onClick={handleClick}
      style={{
        backgroundColor: '#3367D6',
        color: 'white',
        padding: '10px 15px',
        border: 'none',
        borderRadius: '4px',
        fontWeight: 'bold',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="18" 
        height="18" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <path d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4M17 9l-5 5-5-5M12 12.8V2.5"/>
      </svg>
      Install App
    </button>
  );
};

export default InstallPWA;