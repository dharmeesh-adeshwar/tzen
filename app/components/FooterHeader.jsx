
// import { useEffect, useRef, useState } from "react";

// export default function FooterHeader({ page }) {
//   if (!page) return null;

//   const heading =
//     page.metafields?.find((m) => m.key === "footer_header_text")?.value || "";
//   const bgColor =
//     page.metafields?.find((m) => m.key === "footer_header_bg")?.value || "#fff";

//   const sectionRef = useRef(null);
//   const [isSticky, setIsSticky] = useState(false);
//   const [initialOffsetTop, setInitialOffsetTop] = useState(0);

//   useEffect(() => {
//     if (sectionRef.current) {
//       // Save the initial position
//       setInitialOffsetTop(sectionRef.current.offsetTop);
//     }

//     const handleScroll = () => {
//       const scrollPosition = window.scrollY;

//       // Toggle sticky ON when scrolling down past the section
//       // Toggle sticky OFF when scrolling back up to the initial position
//       if (scrollPosition >= initialOffsetTop) {
//         setIsSticky(true);
//       } else {
//         setIsSticky(false);
//       }
//     };

//     window.addEventListener("scroll", handleScroll);

//     return () => window.removeEventListener("scroll", handleScroll);
//   }, [initialOffsetTop]);

//   return (
//     <section
//       ref={sectionRef}
//       className={`h-[10vh] flex justify-center items-center transition-all
//         ${isSticky ? "fixed top-0 left-0 w-full z-50" : ""}`}
//       style={{ backgroundColor: bgColor }}
//     >
//       <h2 className="text-xl">{heading}</h2>
//     </section>
//   );
// }
import { useEffect, useRef, useState } from "react";

export default function FooterHeader({ page }) {
  if (!page) return null;

  const heading =
    page.metafields?.find((m) => m.key === "footer_header_text")?.value || "";
  const bgColor =
    page.metafields?.find((m) => m.key === "footer_header_bg")?.value || "#fff";

  const sectionRef = useRef(null);
  const [isSticky, setIsSticky] = useState(false);
  const [sectionTop, setSectionTop] = useState(0);

  useEffect(() => {
    // Get the initial position of the section
    const updatePosition = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        setSectionTop(rect.top + scrollTop);
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);

    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      // Only stick when scrolled past the section's original position
      if (scrollTop >= sectionTop) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener('resize', updatePosition);
    };
  }, [sectionTop]);

  return (
    <>
      {/* Placeholder to maintain layout when sticky */}
      {isSticky && <div style={{ height: '10vh' }} />}
      
      <section
        ref={sectionRef}
        className={`h-[10vh] flex justify-center items-center z-70 transition-all ${
          isSticky ? 'fixed top-0 left-0 w-full' : 'relative'
        }`}
        style={{ backgroundColor: bgColor }}
      >
        <h2 className="text-xl">{heading}</h2>
      </section>
    </>
  );
}