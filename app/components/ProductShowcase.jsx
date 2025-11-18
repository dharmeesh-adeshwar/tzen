import React, {useState,useEffect} from 'react';
import {Image} from '@shopify/hydrogen';
import {Link} from 'react-router';
import AOS from "aos";
import "aos/dist/aos.css";
// Small reusable toggle that visually matches the provided photo
function DayNightToggle({isDay, setIsDay}) {
  return (
    <div className="flex flex-col items-center gap-2 select-none">
      {/* Top labels "AM / PM" */}
      <div className="flex items-center gap-8 text-xs font-semibold">
        <span
          className={`transition-opacity ${isDay ? 'opacity-100 text-gray-700' : 'opacity-40 text-gray-400'}`}
        >
          AM
        </span>
        <span
          className={`transition-opacity ${!isDay ? 'opacity-100 text-white' : 'opacity-40 text-gray-400'}`}
        >
          PM
        </span>
      </div>

      {/* Toggle pill */}
      <div className="relative rounded-2xl p-1 bg-white/40 backdrop-blur-md border border-white/30 shadow-sm">
        {/* Inner pill container */}
        <div className="flex items-center gap-1 bg-transparent rounded-xl p-1">
          {/* Left (day) button */}
          <button
            onClick={() => setIsDay(true)}
            aria-pressed={isDay}
            className={`flex items-center justify-center w-12 h-10 rounded-lg transition-all duration-200 outline-none focus:ring-2 focus:ring-offset-1 focus:ring-white/40 ${
              isDay ? 'bg-black/80 text-white' : 'bg-white/60 text-gray-700'
            }`}
          >
            {/* Sun icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M6.76 4.84l-1.8-1.79L3.17 4.84l1.79 1.8 1.8-1.8zM1 13h3v-2H1v2zm10 9h2v-3h-2v3zm8.83-18.95l-1.79 1.8 1.8 1.79 1.79-1.8-1.8-1.79zM17.24 19.16l1.8 1.79 1.79-1.79-1.8-1.8-1.79 1.8zM20 11v2h3v-2h-3zM4.22 18.36l1.8-1.79-1.79-1.8-1.8 1.79 1.79 1.8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>

          {/* Right (night) button */}
          <button
            onClick={() => setIsDay(false)}
            aria-pressed={!isDay}
            className={`flex items-center justify-center w-12 h-10 rounded-lg transition-all duration-200 outline-none focus:ring-2 focus:ring-offset-1 focus:ring-white/40 ${
              !isDay ? 'bg-white text-gray-900' : 'bg-white/40 text-gray-400'
            }`}
          >
            {/* Moon icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M21 12.79A9 9 0 0111.21 3 7 7 0 1012 21a9 9 0 009-8.21z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Bottom labels in Japanese like the photo */}
      <div className="flex items-center gap-8 text-xs text-white">
        <span
          className={`transition-opacity ${isDay ? 'opacity-100' : 'opacity-40'}`}
        >
          午前
        </span>
        <span className={`${!isDay ? 'opacity-100' : 'opacity-40'}`}>午後</span>
      </div>
    </div>
  );
}

export default function ProductShowcase({page}) {
  useEffect(() => {
    AOS.init({
      duration: 500,
      once: false,
      startEvent: "DOMContentLoaded", // ensure it fires on load
    });
  
    AOS.refreshHard();
  }, []);
  const [isDay, setIsDay] = useState(true);
  if (!page) return null;

  const getField = (key) => page.metafields?.find((f) => f.key === key);

  // Products
  const dayProduct = getField('day_product')?.reference;
  const nightProduct = getField('night_product')?.reference;

  // Backgrounds
  const dayProductBg = getField('day_product_bg')?.reference?.image?.url;
  const nightProductBg = getField('night_product_bg')?.reference?.image?.url;
  const dayOtherBg = getField('day_other_bg')?.reference?.image?.url;
  const nightOtherBg = getField('night_other_bg')?.reference?.image?.url;

  const activeProduct = isDay ? dayProduct : nightProduct;

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Background Split */}
      <div className="absolute inset-0 flex transition-all duration-700 pointer-events-none">
        <div
          className={`relative w-1/2 h-full bg-cover bg-center transition-all duration-700 ${
            isDay ? 'opacity-30' : ''
          }`}
          style={{
            backgroundImage: `url(${isDay ? dayProductBg : nightOtherBg})`,
          }}
        />

        <div
          className="relative w-1/2 h-full bg-cover bg-center transition-all duration-700"
          style={{
            backgroundImage: `url(${isDay ? dayOtherBg : nightProductBg})`,
          }}
        >
          {!isDay && <div className="absolute inset-0 bg-black/70" />}
        </div>
      </div>

      {/* Toggle - positioned same place as your screenshot */}
      {/* Toggle - centered on screen */}
      <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none">
        <div
          className="w-44 h-28 rounded-2xl overflow-hidden flex items-center justify-center pointer-events-auto z-50"
          // style={{ background: "#d7f7e0" }}
        >
          <div className="p-2 pointer-events-auto">
            <DayNightToggle isDay={isDay} setIsDay={setIsDay} />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 grid grid-cols-2 h-full transition-all duration-700">
        {/* LEFT SIDE */}
        <div
          className={`flex flex-col justify-center items-center text-center px-8 transition-all duration-700 ${
            isDay ? 'order-1' : 'order-2'
          }`}
        >
          <h2
            className="text-2xl font-light uppercase tracking-wide mb-4"
            data-aos="fade-left"
            style={{color: isDay ? '#111' : '#f3f3f3'}}
          >
            {activeProduct?.title || 'Product Title'}
          </h2>
          {activeProduct?.images?.nodes?.[0] && (
            <Image
              data={activeProduct.images.nodes[0]}
              className="w-56 h-auto mb-6"
            />
          )}

          <div
            className="max-w-md text-sm mb-4"
            data-aos="fade-left"
            style={{
              color: isDay ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.8)',
            }}
            dangerouslySetInnerHTML={{__html: activeProduct?.descriptionHtml}}
          />

          {activeProduct && (
            <Link
              data-aos="fade-left"
              to={`/products/${activeProduct.handle}`}
              className="
                px-5 py-2 text-xs uppercase tracking-widest mt-4 
                flex flex-col gap-2 rounded-lg bg-white/80 backdrop-blur-2xl
                transition-all duration-300
                hover:pt-3 hover:shadow-[0_-8px_15px_rgba(0,0,0,0.25)]
              "
              style={{
                color: '#000',
                letterSpacing: '0.1em',
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
            isDay ? 'order-2' : 'order-1'
          }`}
        >
          <p
            className="uppercase tracking-wider text-sm"
            style={{
              color: isDay ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.9)',
            }}
          >
            {isDay ? 'AM | 午前 Ritual' : 'PM | 午後 Ritual'}
          </p>
        </div>
      </div>
    </section>
  );
}
