import { Link } from "react-router";

export default function Footer({ page }) {
  if (!page || !page.metafields) return null;

  const fields = page.metafields;
  const metafieldsByKey = Object.fromEntries(fields.map((m) => [m.key, m]));

  const headline = metafieldsByKey["headline"]?.value;
  const copyright = metafieldsByKey["copyright"]?.value;
  const bgColor = metafieldsByKey["bg"]?.value;
  const logo = metafieldsByKey["logo"]?.reference?.image?.url;

  const linksField = fields.find((f) => f.key === "links");
  const links =
    linksField?.references?.nodes
      ?.map((ref) => {
        if (!ref || !ref.title || !ref.handle) return null;

        return {
          title: ref.title,
          url: `/pages/${ref.handle}`,
        };
      })
      .filter(Boolean) || [];

  return (
    <footer
      className="w-full min-h-screen flex flex-col px-6 py-24 text-center"
      style={{
        backgroundColor: bgColor || "#f9fafb",
      }}
    >
      <div className="max-w-2xl w-full mx-auto flex flex-col items-center justify-center space-y-8 flex-grow">
        {/* Logo */}
        {logo && (
          <div className="flex justify-center mb-4">
            <img src={logo} alt="Footer Logo" className="h-24 w-auto" />
          </div>
        )}

        {/* Headline */}
        {headline && (
          <p className="text-base font-medium text-black">{headline}</p>
        )}

        {/* Navigation Links */}
        {links.length > 0 && (
          <nav className="flex justify-center items-center gap-8">
            {links.map((item, i) => (
              <div key={i} className="flex items-center gap-8 capitalize">
                <Link
                  to={item.url}
                  className="text-lg tracking-wider text-gray-700 hover:text-black transition-colors duration-200 capitalize!"
                >
                  {item.title}
                </Link>
                {i < links.length - 1 && (
                  <span className="text-gray-400">—</span>
                )}
              </div>
            ))}
          </nav>
        )}
      </div>

      {/* Copyright */}
      {copyright && (
        <div className="pt-8 mt-auto">
          <p className="text-xs text-gray-500 tracking-wide">{copyright}</p>
        </div>
      )}
    </footer>
  );
}
