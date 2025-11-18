import React from "react";

export default function Description({ page }) {
  if (!page) return null;

  const findField = (key) => page?.metafields?.find((f) => f.key === key);

  const abouthead =
    findField("heading")?.value || "ABOUT";
  const aboutdesc =
    findField("desc")?.value ||
    "TZEN brings Japanese matcha and hojicha to India with calm precision and modern design. Every detail - from sourcing to packaging - is guided by authenticity, purity, and quiet luxury. The result is tea that feels elevated, balanced, and made for everyday living.";
  const aboutLogo =
    findField("logo")?.reference?.image?.url ||
    "";
    const aboutBgImage =
    findField("bgimage")?.reference?.image?.url ||
    "";
  const bgColor = findField("bgcolor")?.value || "#E8E4D9";

  return (
    <>
    <section
      style={{ backgroundColor: bgColor }}
      className="w-full p-8"
    >
      <div className="max-w-full px-8 mx-auto flex flex-col justify-between h-full min-h-[50vh]">
        {/* Top Row: heading + logo */}
        <div className="w-full">
            <div className="flex items-center gap-4">
                {/* Left: heading */}
                {abouthead && (
                    <p className="text-xs md:text-sm tracking-widest uppercase text-gray-700 pb-1 font-sans">
                    {abouthead}
                    </p>
                )}
                <hr className="flex-1 opacity-20"/>
            </div>
          {/* Right: logo */}
            <div className="flex items-start justify-end w-full">
                {aboutLogo && (
                    <img
                    src={aboutLogo}
                    alt="About Logo"
                    className="w-24 md:w-36 object-contain"
                    />
                )}
            </div>
        </div>

        {/* Spacer: gives breathing room between top and description */}
        <div className="flex-1" />

        {/* Bottom: description */}
        {aboutdesc && (
          <div className="max-w-2xl text-left">
            <p className="text-sm md:text-base leading-relaxed text-gray-800">
              {aboutdesc}
            </p>
          </div>
        )}
      </div>
    </section>
    {/* Image Section */}
    {aboutBgImage && (
        <section
          className="min-h-[50vh] w-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${aboutBgImage})`,
          }}
        ></section>
      )}
    </>
  );
}
