import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { createClient } from '../../lib/supabase/client';

export default function PdfPreviewModal({ open, onClose, amazonLink }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setError(null);
    setPdfUrl(null);
    const supabase = createClient();
    supabase.storage
      .from('homepage-book')
      .createSignedUrl('OZGuideSample.pdf', 60 * 60)
      .then(({ data, error }) => {
        console.log('Supabase signed URL data:', data);
        console.log('Supabase signed URL error:', error);
        if (error || !data?.signedUrl) {
          setError("Failed to fetch PDF. Please try again later.");
          setLoading(false);
        } else {
          setPdfUrl(data.signedUrl);
          setLoading(false);
        }
      });
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="modal-bg"
          className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
        >
          <motion.div
            key="modal-content"
            className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-white/20 dark:border-gray-700/50 flex flex-col"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white text-center w-full">
                Preview: Free Chapter
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 absolute top-6 right-6"
                aria-label="Close"
              >
                <X size={24} />
              </button>
            </div>
            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh] flex-1 flex flex-col items-center justify-center w-full">
              {loading && !error && (
                <div className="text-lg text-gray-500 dark:text-gray-400">Loading PDF...</div>
              )}
              {error && (
                <div className="text-red-500 text-lg">{error}</div>
              )}
              {pdfUrl && !error && !loading && (
                <iframe
                  src={pdfUrl}
                  width="100%"
                  height="600px"
                  style={{ border: 0 }}
                  title="PDF Preview"
                  allowFullScreen
                />
              )}
            </div>
            {/* Footer */}
            <div className="flex flex-col sm:flex-row gap-4 justify-end p-6 border-t border-gray-200 dark:border-gray-700">
              <a
                href={pdfUrl || '#'}
                download
                className="w-full sm:w-auto bg-gradient-to-r from-[#1e88e5] to-[#1565c0] text-white px-8 py-3 rounded-lg font-bold text-lg shadow hover:shadow-lg text-center"
                target="_blank"
                rel="noopener noreferrer"
                aria-disabled={!pdfUrl}
                tabIndex={pdfUrl ? 0 : -1}
                style={{ pointerEvents: pdfUrl ? 'auto' : 'none', opacity: pdfUrl ? 1 : 0.5 }}
              >
                Download PDF
              </a>
              <a
                href={amazonLink || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-8 py-3 rounded-lg font-bold text-lg shadow hover:shadow-lg text-center disabled:opacity-60"
                aria-disabled={!amazonLink}
                tabIndex={amazonLink ? 0 : -1}
                style={{ pointerEvents: amazonLink ? 'auto' : 'none', opacity: amazonLink ? 1 : 0.5 }}
              >
                Buy Book on Amazon
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 