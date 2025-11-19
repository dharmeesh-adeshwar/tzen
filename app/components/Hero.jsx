import React, {useEffect} from "react";
import { Image } from "@shopify/hydrogen";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Hero({ page }) {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true, // Changed to true so animations only happen once
      startEvent: "DOMContentLoaded",
      offset: 0, // Trigger immediately when element is in view
      disable: false, // Ensure AOS is enabled
    });
    
    // Force trigger animations immediately on mount
    setTimeout(() => {
      AOS.refresh();
    }, 100);
  }, []);

  if (!page) return null;

  const findField = (key) => page?.metafields?.find((f) => f.key === key);

  const heroImage = findField("image")?.reference?.image?.url || "";
  const heroLogo = findField("logo")?.reference?.image?.url || "";
  const leftText = findField("subheadingleft")?.value || "";
  const leftText2 = findField("subheadingleft2")?.value || "";
  const rightText = findField("subheadingright")?.value || "";
  const rightText2 = findField("subheadingright2")?.value || "";

  return (
    <section className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center z-0">
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
      <div 
        className="relative flex flex-col items-center justify-center text-white text-center px-6" 
        data-aos="zoom-in"
        data-aos-delay="0"
      >
        {heroLogo && (
          <Image
            data={{ url: heroLogo, altText: "Hero logo" }}
            className="w-40 md:w-56 mb-8 object-contain"
          />
        )}
      </div>

      {/* Bottom subheadings */}
      <div className="absolute bottom-10 left-0 right-0 flex justify-between items-end px-8 text-white z-10">
        {(leftText || leftText2) && (
          <div 
            className="flex flex-col items-start max-w-[45%]" 
            data-aos="fade-right"
            data-aos-delay="200"
          >
            {leftText && (
              <h2 className="text-lg md:text-xl font-light text-left">
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

        {(rightText || rightText2) && (
          <div 
            className="flex flex-col items-end max-w-[45%] text-right" 
            data-aos="fade-left"
            data-aos-delay="200"
          >
            {rightText && (
              <h2 className="text-lg md:text-xl font-light">{rightText}</h2>
            )}
            {rightText2 && (
              <h3 className="text-base md:text-xl font-light opacity-80">
                {rightText2}
              </h3>
            )}
          </div>
        )}
      </div>
    </section>
  );
}