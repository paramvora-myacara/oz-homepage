// ExitPopup.js
"use client";
import React from "react";

export default function ExitPopup({ open, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-2 text-lg font-bold">Wait! Before you go...</h2>
        <p className="mb-4">
          Don't miss out on our latest Opportunity Zone listings and insights!
        </p>
        <button
          className="mt-2 rounded bg-blue-600 px-4 py-2 text-white"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}
