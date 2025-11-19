export default function Principles({ page }) {
  if (!page) return null;

  const fields = Object.fromEntries(
    page.metafields.map((m) => [m.key, m])
  );

  return (
    <section 
      className="h-screen w-full flex items-center justify-center relative z-60"
      style={{ backgroundColor: fields.bgcolor?.value }}
    >
      <div className="h-full grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <div className="flex flex-col items-center space-y-12 justify-center border-[#b7b2a8]">
          <h3 className="text-lg font-medium">{fields.heading_left?.value}</h3>
          <img
            src={fields.image_left?.reference?.image?.url}
            className="w-16 opacity-70"
            alt=""
          />
          <p
            className="text-sm"
            dangerouslySetInnerHTML={{
                __html: fields.desc_left?.value.replace(/,/g, ',<br/>')
            }}
          />
        </div>

        <div className="flex flex-col items-center space-y-12 border-l border-r justify-center px-6">
          <h3 className="text-lg font-medium">{fields.heading_center?.value}</h3>
          <img
            src={fields.image_center?.reference?.image?.url}
            className="w-16 opacity-70"
            alt=""
          />
          <p className="text-sm">{fields.desc_center?.value}</p>
        </div>

        <div className="flex flex-col items-center space-y-12 justify-center border-[#b7b2a8]">
          <h3 className="text-lg font-medium">{fields.heading_right?.value}</h3>
          <img
            src={fields.image_right?.reference?.image?.url}
            className="w-16 opacity-70"
            alt=""
          />
          <p className="text-sm">{fields.desc_right?.value}</p>
        </div>
      </div>
    </section>
  );
}