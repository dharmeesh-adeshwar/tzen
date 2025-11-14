export default function Principles({ page }) {
  if (!page) return null;

  const fields = Object.fromEntries(
    page.metafields.map((m) => [m.key, m])
  );

  return (
    <section className="h-screen w-full bg-[#f5efe4] flex items-center justify-center">
      <div className=" h-full grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        
        {/* Block 1 */}
        <div className="flex flex-col items-center space-y-12 justify-center border-[#b7b2a8]">
          <h3 className="text-lg font-medium">{fields.heading_left?.value}</h3>
          <img
            src={fields.image_left?.reference?.image?.url}
            className="w-16 opacity-70"
            alt=""
          />
          {/* <p className="text-sm text-gray-700">{fields.desc_left?.value}</p> */}
          <p
            className="text-sm "
            dangerouslySetInnerHTML={{
                __html: fields.desc_left?.value.replace(/,/g, ',<br/>')
            }}
            />
        </div>

        {/* Block 2 */}
        <div className="flex flex-col items-center space-y-12 border-l border-r justify-center px-6">
          <h3 className="text-lg font-medium">{fields.heading_center?.value}</h3>
          <img
            src={fields.image_center?.reference?.image?.url}
            className="w-16 opacity-70"
            alt=""
          />
          <p className="text-sm">{fields.desc_center?.value}</p>
          {/* <p
            className="text-sm leading-relaxed text-center font-medium"
            dangerouslySetInnerHTML={{
                __html: fields.desc_center?.value.replace(/,/g, ',<br/>')
            }}
            /> */}
        </div>

        {/* Block 3 */}
        <div className="flex flex-col items-center space-y-12 justify-center  border-[#b7b2a8]">
            <h3 className="text-lg font-medium">{fields.heading_right?.value}</h3>
            <img
                src={fields.image_right?.reference?.image?.url}
                className="w-16 opacity-70"
                alt=""
            />
          <p className="text-sm">{fields.desc_right?.value}</p>
          {/* <p
            className="text-sm leading-relaxed text-center font-medium"
            dangerouslySetInnerHTML={{
                __html: fields.desc_right?.value.replace(/—/g, '—<br/>')
            }}
            /> */}
            {/* <p
            className="text-sm leading-relaxed text-right font-medium"
            dangerouslySetInnerHTML={{
                __html: fields.desc_right?.value.replace(/,/g, ',<br/>')
            }}
            /> */}
        </div>

      </div>
    </section>
  );
}
