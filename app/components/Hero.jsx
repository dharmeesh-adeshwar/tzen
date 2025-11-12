import React from "react";
import { Image } from "@shopify/hydrogen";

export default function Hero({ page }) {
  if (!page) return null;

  // Helper to find metafields
  const findField = (key) => page?.metafields?.find((f) => f.key === key);

  // Metafield values
  const heroImage = findField("image")?.reference?.image?.url || "";
  const heroLogo = findField("logo")?.reference?.image?.url || "";
  const leftText = findField("subheadingleft")?.value || "";
  const leftText2 = findField("subheadingleft2")?.value || "";
  const rightText = findField("subheadingright")?.value || "";
  const rightText2 = findField("subheadingright2")?.value || "";

  console.log("Hero data:", {
    heroImage,
    heroLogo,
    leftText,
    leftText2,
    rightText,
    rightText2,
  });

  return (
    <section className="relative w-full h-screen overflow-hidden flex items-center justify-center">
      {/* Background image */}
      {heroImage && (
        <Image
          data={{ url: heroImage, altText: "Hero background" }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20"></div>

      {/* Center logo */}
      <div className="relative flex flex-col items-center justify-center text-white text-center px-6">
        {heroLogo && (
          <Image
            data={{ url: heroLogo, altText: "Hero logo" }}
            className="w-40 md:w-56 mb-8 object-contain"
          />
        )}
      </div>

      {/* Bottom subheadings */}
      <div className="absolute bottom-10 left-0 right-0 flex justify-between items-end px-8 text-white z-10">
        {/* Left text group */}
        {(leftText || leftText2) && (
          <div className="flex flex-col items-start max-w-[45%]">
            {leftText && (
              <h2 className="text-lg md:text-2xl font-light text-left">
                {leftText}
              </h2>
            )}
            {leftText2 && (
              <h3 className="text-base md:text-xl font-light text-left opacity-80">
                {leftText2}
              </h3>
            )}
          </div>
        )}

        {/* Right text group */}
        {(rightText || rightText2) && (
          <div className="flex flex-col items-end max-w-[45%] text-right">
            {rightText && (
              <h2 className="text-lg md:text-2xl font-light">{rightText}</h2>
            )}
            {rightText2 && (
              <h3 className="text-base md:text-xl font-light opacity-80 ">
                {rightText2}
              </h3>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
