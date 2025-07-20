import { useState, useEffect } from "react";
import { useAuth } from "../../../lib/auth/AuthProvider";

export function useExitPopup() {
  const [showExitPopup, setShowExitPopup] = useState(false);
  const { user, userLoading } = useAuth();

  useEffect(() => {
    // Correctly wait for user authentication check to complete
    if (userLoading) {
      return;
    }

    // If the user is logged in, no popup is needed
    if (user) {
      return;
    }

    // --- Exit-Intent Logic ---

    const isMobile = /iPhone|iPad|iPod|Android/i.test(
      navigator.userAgent || "",
    );

    // Helper to show popup only once per session
    const showPopupIfNotShown = () => {
      if (!sessionStorage.getItem("exitPopupShown")) {
        setShowExitPopup(true);
        sessionStorage.setItem("exitPopupShown", "true");
        // Go back to remove the dummy history state we added
        window.history.back();
      }
    };

    // Push a dummy state to history to detect back button/gesture navigation
    window.history.pushState({ page: "homepage" }, "", window.location.href);

    const handlePopState = () => {
      showPopupIfNotShown();
    };
    window.addEventListener("popstate", handlePopState);

    let handleMouseLeave;
    if (!isMobile) {
      // For desktop, track when the mouse leaves the top of the viewport
      handleMouseLeave = (e) => {
        if (e.clientY < 0) {
          showPopupIfNotShown();
        }
      };
      document.addEventListener("mouseleave", handleMouseLeave);
    }

    // Cleanup listeners when the component unmounts or dependencies change
    return () => {
      window.removeEventListener("popstate", handlePopState);
      if (handleMouseLeave) {
        document.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [user, userLoading]);

  return { showExitPopup, setShowExitPopup };
} 