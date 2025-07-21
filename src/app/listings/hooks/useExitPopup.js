import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../../lib/auth/AuthProvider";

export function useExitPopup() {
  const [showExitPopup, setShowExitPopup] = useState(false);
  const { user, loading: userLoading } = useAuth(); // Renamed to avoid conflict
  const isInitialMount = useRef(true);

  useEffect(() => {
    // Only run this logic on the client
    if (typeof window === 'undefined') {
      return;
    }
    
    // On initial mount, we want to know if the user is already logged in
    // After that, we don't want to re-run this on auth changes (i.e., logout)
    if (isInitialMount.current) {
      isInitialMount.current = false;
      // If user is logged in on mount, do nothing.
      if (user) {
        return;
      }
    } else {
      // If this isn't the initial mount, it means auth state changed.
      // We don't want to trigger the popup on logout.
      return;
    }
    
    // If we've gotten this far, it means the user is not logged in on page load.
    // --- Exit-Intent Logic ---

    const isMobile = /iPhone|iPad|iPod|Android/i.test(
      navigator.userAgent || "",
    );

    // Helper to show popup only once per session
    const showPopupIfNotShown = () => {
      if (!sessionStorage.getItem("exitPopupShown")) {
        setShowExitPopup(true);
        sessionStorage.setItem("exitPopupShown", "true");
        // This line is problematic on logout, but required for the back-button popup trigger.
        // The logic above should prevent this from running on logout.
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

    // Cleanup listeners when the component unmounts
    return () => {
      window.removeEventListener("popstate", handlePopState);
      if (handleMouseLeave) {
        document.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
    // We only want this to run once on initial load for an unauthenticated user.
    // We've handled the auth check inside the effect.
  }, [user]); // We keep `user` here to ensure we have the latest auth state on mount.

  return { showExitPopup, setShowExitPopup };
} 