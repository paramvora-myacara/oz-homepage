// ExitPopup.js
"use client";
import React from "react";
import { useAuthNavigation } from "../../lib/auth/useAuthNavigation";

export default function ExitPopup({ open, onClose }) {
  const { navigateWithAuth } = useAuthNavigation();

  if (!open) return null;

  const handleJoinVip = () => {
    navigateWithAuth("/listings"); // Or another relevant page for VIPs
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-2 text-lg font-bold">Wait! Before you go...</h2>
        <p className="mb-4">
          Don't miss out on our latest Opportunity Zone listings and insights!
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            className="rounded bg-blue-600 px-4 py-2 text-white"
            onClick={handleJoinVip}
          >
            Join Our VIP List
          </button>
          <button
            className="rounded border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-100"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
