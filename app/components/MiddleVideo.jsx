// import React from "react";

// export default function MiddleVideo({ page }) {
//   if (!page) return null;
  
//   // Find the background video from metafields
//   const videoField = page?.metafields?.find((f) => f.key === 'bgvideo');
//   const videoSources = videoField?.reference?.sources;
  
//   // Get the first available video source URL
//   const videoUrl = videoSources?.[0]?.url;
//   const mimeType = videoSources?.[0]?.mimeType || 'video/mp4';
  
//   console.log('Video URL:', videoUrl);
//   console.log('All sources:', videoSources);
  
//   return (
//     <section className="min-h-[80vh] relative">
//       {videoUrl && (
//         <video
//             controls
//             autoPlay 
//             loop 
//             muted
//             playsInline
//             className="absolute top-0 left-0 w-full h-full object-cover" 
//             preload="auto"
//         >
//           <source src={videoUrl} type={mimeType} />
//           Your browser does not support the video tag.
//         </video>
//       )}
//       {/* other content */}
//     </section>
//   );
// }


import { Video } from "@shopify/hydrogen";
import { useEffect, useRef } from "react";

export default function MiddleVideo({ page }) {
  if (!page) return null;

  const videoField = page?.metafields?.find(f => f.key === "bgvideo");
  const videoRefData = videoField?.reference;
  const videoEl = useRef(null);

  useEffect(() => {
    const el = videoEl.current;
    if (el && el.play) {
      const playPromise = el.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn("Autoplay blocked:", err);
        });
      }
    }
  }, [videoRefData]);

  if (!videoRefData) return null;
console.log("video ref data :",videoRefData);
  return (
    <section className="relative min-h-[80vh] overflow-hidden">
      <Video
        ref={videoEl}
        data={videoRefData}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
      />
    </section>
  );
}
