import { useState, useRef } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

// Placeholder for the product canister image URL
const PRODUCT_CANISTER_URL = "https://example.com/canister-image.png";

export default function Shop({ page }) {
  const lightBg = page?.metafields?.find((m) => m.key === "light")?.reference?.image?.url;
  const darkBg = page?.metafields?.find((m) => m.key === "dark")?.reference?.image?.url;
  const text = page?.metafields?.find((m) => m.key === "text")?.value || "";

  const sectionRef = useRef(null);
  const maskPosition = useMotionValue(50); // normalized percent (0 to 100)

  if (!lightBg || !darkBg) return null;

  const handleMove = (clientX) => {
    if (!sectionRef.current) return;

    const rect = sectionRef.current.getBoundingClientRect();
    const position = ((clientX - rect.left) / rect.width) * 100;
    const normalized = Math.max(0, Math.min(100, position));
    animate(maskPosition, normalized, { duration: 0.3 });
  };

  const handleMouseMove = (e) => handleMove(e.clientX);
  const handleTouchMove = (e) => handleMove(e.touches[0].clientX);

const maskClipPath = useTransform(
  maskPosition,
  (v) => `inset(0 ${100 - v}% 0 0)`
);


  const textColor = useTransform(maskPosition, [0, 100], ["#FFFFFF", "#000000"]);

  return (
    <section
      ref={sectionRef}
      className="relative h-[80vh] w-full overflow-hidden"
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
    >
      {/* Base Dark Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${darkBg})` }}
      />

      {/* Light Background with Mask */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${lightBg})`,
          clipPath: maskClipPath,
        }}
      />

      {/* Text */}
      <motion.p
        className="absolute top-12 text-center text-lg z-30 w-full px-4"
        style={{ color: textColor }}
      >
        {text}
      </motion.p>

      {/* Canister Image */}
      

      {/* Buttons */}
      <div className="flex flex-col mt-4 absolute bottom-10 left-1/2 -translate-x-1/2 z-30 pointer-events-auto">
        <button className="bg-white/90 text-black py-2 px-4 mb-2 rounded shadow">
          Shop Matcha
        </button>
        <button className="bg-black/90 text-white py-2 px-4 rounded shadow">
          Shop Hōjicha
        </button>
      </div>
    </section>
  );
}
