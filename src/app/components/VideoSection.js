'use client';

import { motion } from "framer-motion";

// Helper function to convert YouTube watch URLs to embed URLs
function getEmbedUrl(url) {
  if (!url) return url;

  // Check if it's a YouTube watch URL or youtu.be link
  const youtubeWatchRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/;
  const match = url.match(youtubeWatchRegex);

  if (match) {
    const videoId = match[1];
    // Add parameters for better embedding:
    // - modestbranding=1: Reduces YouTube branding
    // - rel=0: Shows related videos only from the same channel
    // - enablejsapi=1: Enables JavaScript API
    // - autoplay=1: Autoplays the video
    // - mute=1: Mutes the video (required by most browsers for autoplay)
    return `https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0&enablejsapi=1&autoplay=1&mute=1`;
  }

  // Return as-is for Google Drive or other URLs
  return url;
}

function VideoPlayer({ url }) {
  const embedUrl = getEmbedUrl(url);

  return (
    <iframe
      src={embedUrl}
      className="absolute inset-0 h-full w-full rounded-2xl border border-gray-200/60 shadow-2xl dark:border-gray-800"
      allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
      allowFullScreen
      title="Video"
    />
  );
}

export default function VideoSection({ videoUrls = [], title, description }) {
  if (!videoUrls || videoUrls.length === 0) return null;

  return (
    <section className="relative z-10 w-full py-12 md:py-16">
      <div className="container mx-auto px-4">
        {(title || description) && (
          <div className="mb-10 text-center">
            {title && (
              <h2 className="font-brand-bold text-3xl md:text-4xl lg:text-5xl mb-4 text-navy dark:text-white">
                {title}
              </h2>
            )}
            {description && (
              <p className="font-brand-normal text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                {description}
              </p>
            )}
          </div>
        )}

        <div className={`mx-auto grid max-w-[1440px] gap-10 ${videoUrls.length > 1 ? 'lg:grid-cols-2' : 'grid-cols-1'}`}>
          {videoUrls.map((url, index) => (
            <motion.div
              key={index}
              className="relative overflow-hidden rounded-2xl bg-black shadow-2xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
                <VideoPlayer url={url} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
