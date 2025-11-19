export default function FooterHeader({ page }) {
  if (!page) return null;

  const heading =
    page.metafields?.find((m) => m.key === "footer_header_text")?.value || "";
  const bgColor =
    page.metafields?.find((m) => m.key === "footer_header_bg")?.value || "#fff";

  return (
    <section
      className="sticky top-0 h-[10vh] flex justify-center items-center z-60"
      style={{ backgroundColor: bgColor }}
    >
      <h2 className="text-xl">{heading}</h2>
    </section>
  );
}