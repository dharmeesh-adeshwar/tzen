import { Link } from "react-router";

export default function Footer({ page }) {
  if (!page) return null;

  const fields = page.metafields || [];

  const headline = fields.find(f => f.key === "headline")?.value; 
  const copyright = fields.find(f => f.key === "copyright")?.value;
  const logo = fields.find(f => f.key === "logo")?.reference?.image?.url;

  // bg metafield (color)
  const bgColor = fields.find(f => f.key === "bg")?.value;

//   const linksField = fields.find(f => f.key === "link")?.value;
//   const links = linksField ? linksField.split(",").map(l => l.trim()) : [];
const linkField = fields.find(f => f.key === "link");

const links = linkField?.references?.nodes?.map(ref => ({
  title: ref.title,
  url: `/${ref.handle}`
})) || [];

console.log("FOOTER FIELDS:", fields);

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

        {/* Japanese Tagline (headline from metafield) */}
        {headline && (
          <p className="text-base font-medium text-black">
            {headline}
          </p>
        )}

        {/* Sub tagline */}

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