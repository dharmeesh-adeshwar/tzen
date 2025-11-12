import React from "react";

export default function MiddleVideo({ page }) {
  if (!page) return null;
  
  // Find the background video URL from metafields
  const videoField = page?.metafields?.find((f) => f.key === 'bgvideo');
  const videoUrl = videoField?.value;
console.log('Video URL:', videoUrl);
  return (
    <section className="min-h-[80vh] relative">
      {videoUrl && (
        <video 
          className="absolute top-0 left-0 w-full h-full object-cover" 
          autoPlay 
          loop 
          muted
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
      {/* You can add other content here if needed */}
    </section>
  );
}
