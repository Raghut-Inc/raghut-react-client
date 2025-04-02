import React, { useEffect } from "react";
import GoogleLogo from "../assets/google_logo.webp";
import { useLocation } from "react-router-dom";

const GoogleSignUp = () => {
  const API_URL = process.env.REACT_APP_API_URL;
  const location = useLocation();

  useEffect(() => {
    // Listen for messages from popup
    const handleMessage = (event) => {
      // Verify origin for security
      if (event.origin !== API_URL) return;

      if (event.data.type === "authSuccess") {
        // Close popup and refresh or redirect as needed
        window.location.reload();
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [API_URL]);

  const handleGoogleSignUp = () => {
    const redirectPath = encodeURIComponent(location.pathname);
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    // Open popup window
    const popup = window.open(
      `${API_URL}/auth/google?redirectPath=${redirectPath}`,
      "googleAuth",
      `width=${width},height=${height},left=${left},top=${top},toolbar=0,scrollbars=0,status=0,resizable=0,location=0,menuBar=0`
    );

    // Check if popup was blocked
    if (!popup || popup.closed || typeof popup.closed === "undefined") {
      alert("Please enable popups for this site to use Google Sign In.");
    }

    // Poll popup status
    const checkPopup = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkPopup);
        // Optionally check authentication status here
        fetch(`${API_URL}/auth/success`, {
          credentials: "include",
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              window.location.reload();
            }
          })
          .catch((err) => console.error("Auth check failed:", err));
      }
    }, 1000);
  };

  return (
    <div className="signupContainer">
      <div className="signupContainer__box__google w-full flex flex-col items-center">
        <button
          className="flex items-center space-x-2 border rounded px-6 py-3 hover:bg-gray-100 transition"
          onClick={handleGoogleSignUp}
        >
          <img src={GoogleLogo} className="w-6 h-6 object-contain flex-shrink-0" alt="Google Logo" />
          <p className="font-medium text-base">Sign in with Google</p>
        </button>
      </div>
    </div>
  );
};

export default GoogleSignUp;
