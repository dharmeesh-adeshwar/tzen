export default function FeaturedProduct({page}) {
  if (!page) return null;

  const fields = page.metafields || [];

  const bgImage = fields.find((f) => f.key === 'featured_product')?.reference
    ?.image?.url;

  const textLeft = fields.find(
    (f) => f.key === 'featured_product_text1',
  )?.value;

  const textRight = fields.find(
    (f) => f.key === 'featured_product_text2',
  )?.value;

  const textBottom = fields.find(
    (f) => f.key === 'featured_product_text3',
  )?.value;

  return (
    <section
      className="
        w-full min-h-screen 
        bg-center bg-no-repeat bg-cover 
        px-20 grid grid-cols-2 gap-[30%]
      "
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundColor: '#dcdde0', // matches grey background
      }}
    >
      {/* LEFT TEXT
      {textLeft && (
        <div className="absolute left-32 top-1/4 text-center text-black opacity-90 max-w-xs">
          <p className="text-lg font-medium">{textLeft}</p>
        </div>
      )}

      {/* RIGHT TEXT 
      {textRight && (
        <div className="absolute right-32 top-1/4 text-center text-black opacity-90 max-w-xs">
          <p className="text-sm leading-relaxed">{textRight}</p>
        </div>
      )}

      {/* BOTTOM TEXT
      {textBottom && (
        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 text-center opacity-80 max-w-md">
          <p className="text-sm">{textBottom}</p>
        </div>
      )}

      {/* PURCHASE BUTTON 
      <button className="absolute right-32 bottom-20 bg-white px-6 py-3 rounded-md shadow text-sm hover:shadow-lg transition">
        PURCHASE
      </button> */}

      <div className="flex flex-col justify-between items-end p-[10%]">
        <div>
          {textLeft && (
            <div className="text-black opacity-90 max-w-xs">
              <p className="text-xl font-medium">{textLeft}</p>
            </div>
          )}
        </div>
        <div className="h-[70%] border-r border-black">

        </div>
        <div>
          {textRight && (
            <div className="text-black opacity-90 max-w-md">
              <p
                className="text-sm leading-relaxed text-right font-medium"
                dangerouslySetInnerHTML={{
                    __html: textRight.replace(/,/g, ',<br/>')
                }}
                />

            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col justify-between p-[10%]">
        <div>
          {textBottom && (
            <div className="opacity-80 max-w-xs">
              <p
                className="text-sm leading-relaxed text-left font-medium"
                dangerouslySetInnerHTML={{
                    __html: textBottom.replace(/,/g, ',<br/>')
                }}
                />
            </div>
          )}
        </div>
        <div className="h-[70%] border-l border-black"></div>
        <div className="flex">
            <div className="p-2 rounded-br-2xl rounded-bl-2xl rounded-tl-sm rounded-tr-sm border-1">
            <button className="bg-transparent px-6 py-3 hover:bg-[#d2e3b3]/80 text-sm transition rounded-br-2xl rounded-bl-2xl rounded-tl-sm rounded-tr-sm hover:cursor-pointer hover:border hover:border-gray-400">
                <p>PURCHASE</p>
                <p>お買い上げ</p>
            </button>
            </div>
        </div>
      </div>
      {/* <div></div> */}
    </section>
  );
}
