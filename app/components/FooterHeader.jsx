export default function FooterHeader({ page }) {
  if (!page) return null;

  const heading =
    page.metafields?.find((m) => m.key === "footer_header")?.value || "";

  const bgColor =
    page.metafields?.find((m) => m.key === "footer_header_bg")?.value || "#fff";

  return (
    <section
      className="h-[10vh] flex justify-center items-center"
      style={{ backgroundColor: bgColor }}   // ← apply bg color dynamically
    >
      <h2 className="text-xl">{heading}</h2>
    </section>
  );
}
