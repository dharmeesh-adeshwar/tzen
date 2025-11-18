import { useEffect, useRef, useState } from "react";

export default function FooterHeader({ page }) {
  if (!page) return null;

  const heading =
    page.metafields?.find((m) => m.key === "footer_header_text")?.value || "";

  const bgColor =
    page.metafields?.find((m) => m.key === "footer_header_bg")?.value || "#fff";

  const sectionRef = useRef(null);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();

      // When top hits viewport top or crosses it = sticky ON
      if (rect.top <= 0) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`
        h-[10vh] flex justify-center items-center transition-all
        ${isSticky ? "fixed top-0 left-0 w-full z-50" : ""}
      `}
      style={{ backgroundColor: bgColor }}
    >
      <h2 className="text-xl">{heading}</h2>
    </section>
  );
}
