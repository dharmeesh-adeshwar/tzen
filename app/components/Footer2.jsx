import { Link } from "react-router";

export default function Footer({ page }) {
  // Check if page data is available and contains the expected metafields array.
  if (!page || !page.metafields) return null;

  // Get the metafields directly from the shop object (which is named 'page' in the prop)
  const fields = page.metafields;

  // Transform the array into an object map for easier access
  const metafieldsByKey = Object.fromEntries(
    fields.map((m) => [m.key, m])
  );
  
  // 1. Correctly extract all values using the object map
  const headline = metafieldsByKey["headline"]?.value;
  const copyright = metafieldsByKey["copyright"]?.value;
  const bgColor = metafieldsByKey["bg"]?.value;

  // Logo access is correct
  const logo = metafieldsByKey["logo"]?.reference?.image?.url;

  // 2. Use the correct key "links"
  const linksField = fields.find(f => f.key === "links");
  
  // Access the references nodes for the links with extra safety
  const links = linksField?.references?.nodes
    ?.map(ref => {
        // ⚠️ FINAL SAFETY CHECK: Skip if the link reference is malformed
        if (!ref || !ref.title || !ref.handle) return null;

        return {
          title: ref.title,
          // Note: The GraphQL response used handle, so this URL structure is correct
          url: `/pages/${ref.handle}`, 
        };
    })
    // Filter out any null entries added by the safety check above
    .filter(Boolean) || [];

  // console.log("FOOTER FIELDS:", fields);

  return (
    <footer
      className="w-full min-h-screen flex flex-col items-center justify-center px-6 py-24 text-center"
      style={{
        backgroundColor: bgColor || "#f9fafb",
      }}
    >
      <div className="max-w-2xl w-full space-y-8">
        
        {/* Logo */}
        {logo && (
          <div className="flex justify-center mb-4">
            <img
              src={logo}
              alt="Footer Logo"
              className="h-12 w-auto"
            />
          </div>
        )}

        {/* Headline */}
        {headline && (
          <p className="text-base font-medium text-black">
            {headline}
          </p>
        )}

        {/* Navigation Links */}
        {links.length > 0 && (
          <nav className="flex justify-center items-center gap-8 pt-8">
            {links.map((item, i) => (
              <div key={i} className="flex items-center gap-8 capitalize">
                <Link
                to={item.url}
                className="text-lg tracking-wider text-gray-700 hover:text-black transition-colors duration-200 capitalize!"
                >
                {item.title}
                </Link>

                {/* Add dash separator except last */}
                {i < links.length - 1 && (
                  <span className="text-gray-400">—</span>
                )}
              </div>
            ))}
          </nav>
        )}

        {/* Copyright */}
        {copyright && (
          <div className="pt-32">
            <p className="text-xs text-gray-500 tracking-wide">
              {copyright}
            </p>
          </div>
        )}
      </div>
    </footer>
  );
}