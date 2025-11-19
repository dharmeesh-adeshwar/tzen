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

  return (
    <section className="sticky top-0 min-h-[80vh] overflow-hidden z-30">
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