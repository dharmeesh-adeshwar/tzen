import React, { useState } from "react";
import { Image } from "@shopify/hydrogen";
import { Link } from "react-router";
export default function ProductShowcase({ page }) {
  const [isDay, setIsDay] = useState(true);
  if (!page) return null;

  const getField = (key) => page.metafields?.find((f) => f.key === key);

  // Products
  const dayProduct = getField("day_product")?.reference;
  const nightProduct = getField("night_product")?.reference;

  // Backgrounds
  const dayProductBg = getField("day_product_bg")?.reference?.image?.url;
  const nightProductBg = getField("night_product_bg")?.reference?.image?.url;
  const dayOtherBg = getField("day_other_bg")?.reference?.image?.url;
  const nightOtherBg = getField("night_other_bg")?.reference?.image?.url;

  const activeProduct = isDay ? dayProduct : nightProduct;
  const productBg = isDay ? dayProductBg : nightProductBg;
  const otherBg = isDay ? dayOtherBg : nightOtherBg;

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Background Split */}
      {/* Background Split */}
<div className="absolute inset-0 flex transition-all duration-700">
  <div
    className="w-1/2 h-full bg-cover bg-center transition-all duration-700"
    style={{
      backgroundImage: `url(${
        isDay ? dayProductBg : nightOtherBg
      })`,
    }}
  />
  <div
    className="w-1/2 h-full bg-cover bg-center transition-all duration-700"
    style={{
      backgroundImage: `url(${
        isDay ? dayOtherBg : nightProductBg
      })`,
    }}
  />
</div>


      {/* Toggle */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex items-center rounded-full border overflow-hidden"
        style={{
          backgroundColor: "rgba(255,255,255,0.2)",
          backdropFilter: "blur(10px)",
          borderColor: "rgba(255,255,255,0.3)",
        }}
      >
        <div className="">
            <button
            className="p-3 transition-all"
            style={{
                backgroundColor: isDay ? "#fff" : "transparent",
                color: isDay ? "#000" : "#fff",
            }}
            onClick={() => setIsDay(true)}
            >
            ☀️
            </button>
            <button
            className="p-3 transition-all"
            style={{
                backgroundColor: !isDay ? "#fff" : "transparent",
                color: !isDay ? "#000" : "#fff",
            }}
            onClick={() => setIsDay(false)}
            >
            🌙
            </button>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 grid grid-cols-2 h-full transition-all duration-700">
        {/* LEFT SIDE */}
        <div
          className={`flex flex-col justify-center items-center text-center px-8 transition-all duration-700 ${
            isDay ? "order-1" : "order-2"
          }`}
        >
          {activeProduct?.images?.nodes?.[0] && (
            <Image
              data={activeProduct.images.nodes[0]}
              className="w-56 h-auto mb-6"
            />
          )}
          <h2
            className="text-xl uppercase tracking-wide mb-4"
            style={{ color: isDay ? "#111" : "#f3f3f3" }}
          >
            {activeProduct?.title || "Product Title"}
          </h2>
          <p
            className="max-w-md text-sm mb-4"
            style={{
              color: isDay ? "rgba(0,0,0,0.7)" : "rgba(255,255,255,0.8)",
            }}
          >
            {isDay
              ? "Morning ritual for clear focus and steady, gentle energy."
              : "Night ritual for deep unwinding and truly restful sleep."}
          </p>
          {activeProduct && (
            <Link
              to={`/products/${activeProduct.handle}`}
              className="px-5 py-2 text-xs uppercase tracking-widest mt-4 flex flex-col gap-2 rounded-lg bg-white"
              style={{
                // backgroundColor: "#fff",
                color: "#000",
                letterSpacing: "0.1em",
              }}
            >
              <span>Purchase</span>
              <span>お買い上げ</span>
            </Link>
          )}
        </div>

        {/* RIGHT SIDE */}
        <div
          className={`flex flex-col justify-center items-center transition-all duration-700 ${
            isDay ? "order-2" : "order-1"
          }`}
        >
          <p
            className="uppercase tracking-wider text-sm"
            style={{
              color: isDay ? "rgba(0,0,0,0.7)" : "rgba(255,255,255,0.9)",
            }}
          >
            {isDay ? "AM | 午前 Ritual" : "PM | 午後 Ritual"}
          </p>
        </div>
      </div>
    </section>
  );
}
