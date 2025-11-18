import {useLoaderData} from 'react-router';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  getProductOptions,
  getAdjacentAndFirstAvailableVariants,
  useSelectedOptionInUrlParam,
} from '@shopify/hydrogen';
import AOS from "aos";
import "aos/dist/aos.css";
import {ProductPrice} from '~/components/ProductPrice';
import {ProductImage} from '~/components/ProductImage';
import {ProductForm} from '~/components/ProductForm';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import ProductShowcase from '~/components/ProductShowcase';
import Footer from '~/components/Footer2';
import { useEffect } from 'react';
/**
 * @type {Route.MetaFunction}
 */
export const meta = ({data}) => {
  return [
    {title: `Hydrogen | ${data?.product.title ?? ''}`},
    {
      rel: 'canonical',
      href: `/products/${data?.product.handle}`,
    },
  ];
};

/**
 * @param {Route.LoaderArgs} args
 */
export async function loader(args) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return {...deferredData, ...criticalData};
}

// async function loadCriticalData({context, params, request}) {
//   const {handle} = params;
//   const {storefront} = context;

//   if (!handle) throw new Error('Expected product handle to be defined');

//   const [{product}] = await Promise.all([
//     storefront.query(PRODUCT_QUERY, {
//       variables: {handle, selectedOptions: getSelectedProductOptions(request)},
//     }),
//   ]);

//   if (!product?.id) throw new Response(null, {status: 404});

//   redirectIfHandleIsLocalized(request, {handle, data: product});
//   return {product};
// }
// REPLACE your current loadCriticalData function with this one
async function loadCriticalData({context, params, request}) {
  const {handle} = params;
  const {storefront} = context;

  if (!handle) throw new Error('Expected product handle to be defined');

  // We add the FOOTER_QUERY to the parallel fetch
  const [{product}, homepage, {shop}] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      variables: {handle, selectedOptions: getSelectedProductOptions(request)},
    }),
    storefront.query(HOMEPAGE_METAFIELDS_QUERY),
    // 🟢 New: Fetch the global shop data for the footer
    storefront.query(FOOTER_QUERY),
  ]);

  if (!product?.id) throw new Response(null, {status: 404});

  redirectIfHandleIsLocalized(request, {handle, data: product});
  // 🟢 New: Return the shop data
  return {product, homepage, shop};
}
function loadDeferredData() {
  return {};
}

export default function Product() {
  const {product, homepage, shop} = useLoaderData();
  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  useSelectedOptionInUrlParam(selectedVariant.selectedOptions);

  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  const {title, descriptionHtml} = product;

  return (
    <div className="">
      {/* 🟢 New Hero Section */}
      <HeroSection product={product} selectedVariant={selectedVariant} />
      <ProductDescriptionSection product={product} />
      <PreparationSection product={product} />
      <VideoBGSection product={product} />
      {homepage?.page && <ProductShowcase page={homepage.page} />}
      <Footer page={shop} />
      {/* <div className="product-main px-10 mt-12 max-w-4xl mx-auto">
        <h1 className="text-3xl font-semibold">{title}</h1>

        <ProductPrice
          price={selectedVariant?.price}
          compareAtPrice={selectedVariant?.compareAtPrice}
        />

        <br />

        <ProductForm
          productOptions={productOptions}
          selectedVariant={selectedVariant}
        />

        <br /><br />

        <p className="font-semibold text-lg">Description</p>
        <br />

        <div dangerouslySetInnerHTML={{__html: descriptionHtml}} />
        <br />
      </div>

      <Analytics.ProductView
        data={{
          products: [
            {
              id: product.id,
              title: product.title,
              price: selectedVariant?.price.amount || '0',
              vendor: product.vendor,
              variantId: selectedVariant?.id || '',
              variantTitle: selectedVariant?.title || '',
              quantity: 1,
            },
          ],
        }}
      /> */}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 🟣 HERO SECTION COMPONENT                                                   */
/* -------------------------------------------------------------------------- */
// function HeroSection({product, selectedVariant}) {
//   const headerLeft1 = product.metafield_header_text_left_1?.value;
//   const headerLeft2 = product.metafield_header_text_left_2?.value;
//   const headerRight1 = product.metafield_header_text_right_1?.value;
//   const headerRight2 = product.metafield_header_text_right_2?.value;

//   const heroImage = product.metafield_hero_image?.reference?.image;
//   const headerLogo = product.metafield_header_logo?.reference?.image;

//   return (
//     <div className="relative w-full h-screen flex items-center justify-center overflow-hidden">
//       {/* Background Image */}
//       {heroImage && (
//         <img
//           src={heroImage.url}
//           alt={heroImage?.altText ?? ''}
//           className="absolute inset-0 w-full h-full object-cover opacity-90"
//         />
//       )}

//       {/* Dark Overlay */}
//       <div className="absolute inset-0 bg-black opacity-30" />

//       {/* Header Strip */}
//       <div className="absolute top-6 w-full flex items-center justify-between px-10 text-white drop-shadow-lg">
//         {/* Left Header */}
//         <div className="w-xs">
//           <div className="text-lg font-semibold tracking-wide">
//             {headerLeft1}
//           </div>
//           <div className="text-sm opacity-70">{headerLeft2}</div>
//         </div>

//         {/* Logo */}
//         {headerLogo && (
//           <img
//             src={headerLogo.url}
//             alt={headerLogo?.altText ?? ''}
//             className="w-40 drop-shadow-xl"
//           />
//         )}

//         {/* Right Header */}
//         <div className="text-right w-xs">
//           <div className="text-lg font-semibold tracking-wide">
//             {headerRight1}
//           </div>
//           <div className="text-sm opacity-70">{headerRight2}</div>
//         </div>
//       </div>
//       <div className='border border-black p-2 bottom-6'>
//           hi
//       </div>
//     </div>
//   );
// }
function HeroSection({product, selectedVariant}) {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      startEvent: "DOMContentLoaded", // ensure it fires on load
    });
  
    AOS.refreshHard();
  }, []);
  const headerLeft1 = product.metafield_header_text_left_1?.value;
  const headerLeft2 = product.metafield_header_text_left_2?.value;
  const headerRight1 = product.metafield_header_text_right_1?.value;
  const headerRight2 = product.metafield_header_text_right_2?.value;

  const heroImage = product.metafield_hero_image?.reference?.image;
  const headerLogo = product.metafield_header_logo?.reference?.image;

  const priceCurrency =
    selectedVariant?.price?.currencyCode === 'JPY' ? '¥' : '$';
  const priceAmount = selectedVariant?.price?.amount ?? '2,800';

  return (
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      {heroImage && (
        <img
          src={heroImage.url}
          alt={heroImage?.altText ?? ''}
          className="absolute inset-0 w-full h-full object-cover opacity-90"
        />
      )}

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black opacity-30" />

      {/* Header Strip */}
      <div className="absolute top-6 w-full flex items-center justify-between px-10 text-white drop-shadow-lg">
        {/* Left Header */}
        <div className="w-xs fade-right">
          <div className="text-lg font-semibold tracking-wide">
            {headerLeft1}
          </div>
          <div className="text-sm opacity-70">{headerLeft2}</div>
        </div>

        {/* Logo */}
        {headerLogo && (
          <img
            src={headerLogo.url}
            alt={headerLogo?.altText ?? ''}
            className="w-40 drop-shadow-xl"
             data-aos="zoom-in"
          />
        )}

        {/* Right Header */}
        <div className="text-right w-xs fade-left">
          <div className="text-lg font-semibold tracking-wide ">
            {headerRight1}
          </div>
          <div className="text-sm opacity-70">{headerRight2}</div>
        </div>
      </div>

      {/* Center Product Image */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        {product.featuredImage && (
          <img
            src={product.featuredImage.url}
            alt={product.featuredImage.altText ?? product.title}
            className="w-64 h-auto drop-shadow-2xl"
          />
        )}
      </div>

      {/* BOTTOM FIXED PRICE + CART (bottom-6 of h-screen) */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
        {/* Price */}
        <div className="bg-white/40 backdrop-blur-md p-2 px-2 rounded-md shadow-lg flex flex-col items-center border-none space-y-2">
          {/* Currency Switcher */}
          <div className="flex items-center space-x-1 text-black text-sm font-semibold">
            {/* Dollar */}
            <span
              className={`px-2 py-1 rounded-md ${
                priceCurrency === '$' ? 'bg-black text-white' : ''
              }`}
            >
              $
            </span>

            {/* Rupee */}
            <span
              className={`px-2 py-1 rounded-md ${
                priceCurrency === '₹' ? 'bg-black text-white' : ''
              }`}
            >
              ₹
            </span>

            {/* Yen */}
            <span
              className={`px-2 py-1 rounded-md ${
                priceCurrency === '¥' ? 'bg-black text-white' : ''
              }`}
            >
              ¥
            </span>
          </div>

          {/* Price Box */}
          <div className="bg-white/20 px-4 py-1 rounded-md text-gray-900 text-sm font-semibold">
            {priceCurrency}
            {priceAmount}
          </div>
        </div>

        {/* Add to Cart */}
        {/* <button
          className="
            bg-[#EEF6C9]/90
            text-gray-900
            px-6 py-2
            rounded-t-xl rounded-b-2xl
            shadow-[0_4px_10px_rgba(0,0,0,0.25)]
            border border-gray-400/60
            text-sm font-medium
            backdrop-blur-md
            hover:bg-[#f4fbd8]
            transition mt-4
          "
        >
          Add to Cart<br />カートに追加
        </button> */}
        <div className="flex items-center justify-center overflow-hidden">
          <div className="border-t border-black w-4xl" />
          <div className="p-2 rounded-br-2xl rounded-bl-2xl rounded-tl-sm rounded-tr-sm border mt-4" data-aos="fade-up">
            <button className="bg-transparent px-8 py-3 hover:bg-[#d2e3b3]/80 text-sm transition rounded-br-2xl rounded-bl-2xl rounded-tl-sm rounded-tr-sm hover:cursor-pointer">
              <p>Add to Cart</p>
              <p>カートに追加</p>
            </button>
          </div>
          <div className="border-t border-black w-4xl" />
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 🟣 PRODUCT DESCRIPTION SECTION (50vh)                                      */
/* -------------------------------------------------------------------------- */

function ProductDescriptionSection({product}) {
  const heading = product.metafield_page_description_heading?.value;
  const desc = product.metafield_page_description?.value;
  const desc2 = product.metafield_page_description_2?.value;
  const bgColor = product.metafield_page_bg_color?.value || '#E8E4D9';

  const headerLogo = product.metafield_header_logo?.reference?.image?.url;

  return (
    <section
      style={{backgroundColor: bgColor}}
      className="w-full h-[50vh] flex p-8"
    >
      <div className="max-w-full px-6 mx-auto flex flex-col justify-between h-full w-full">
        {/* Top Row: Heading + Line + Logo */}
        <div className="w-full">
          <div className="flex items-center gap-4"  data-aos="fade-left">
            {heading && (
              <p className="text-xs md:text-sm tracking-widest uppercase text-gray-700 pb-1 font-sans">
                {heading}
              </p>
            )}
            <hr className="flex-1 opacity-20" />
          </div>

          {/* Right Logo */}
          <div className="flex items-start justify-end w-full">
            {headerLogo && (
              <img
                src={headerLogo}
                alt="Section Logo"
                className="w-24 md:w-36 object-contain"
              />
            )}
          </div>
        </div>

        {/* Description at bottom */}
        <div className="max-w-3xl text-left " data-aos="fade-left">
          {(desc || desc2) && (
            <>
              {desc && (
                <p className="text-sm md:text-base leading-relaxed text-gray-800 mb-3">
                  {desc}
                </p>
              )}
              <br></br>
              {desc2 && (
                <p className="text-sm md:text-base leading-relaxed text-gray-800">
                  {desc2}
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function PreparationSection({product}) {
  const bgColor = product.metafield_preparation_bg_color?.value || '#F1F1F1';

  const step1Icon = product.product_preparation_one_icon?.reference?.image?.url;
  const step2Icon = product.product_preparation_two_icon?.reference?.image?.url;
  const step3Icon =
    product.product_preparation_three_icon?.reference?.image?.url;

  const step1Desc = product.product_preparation_one_desc?.value;
  const step2Desc = product.product_preparation_two_desc?.value;
  const step3Desc = product.product_preparation_three_desc?.value;

  return (
    <section
      style={{backgroundColor: bgColor}}
      className="w-full min-h-[80vh] flex px-6"
    >
      <div className="w-full max-w-full grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
        {/* STEP 1 */}
        <div className="flex flex-col items-center justify-end md:border-r md:border-gray-400 md:pr-10">
          <p className="text-lg font-semibold mb-12">1.</p>
          {step1Icon && (
            <img
              src={step1Icon}
              alt=""
              className="w-28 h-28 object-contain opacity-80 mb-12"
            />
          )}
          <p className="text-sm text-gray-700 max-w-xs mb-12 font-medium">
            {step1Desc}
          </p>
        </div>

        {/* STEP 2 */}
        <div className="flex flex-col items-center justify-end md:border-r md:border-gray-400 md:px-10">
          <p className="text-lg font-semibold mb-12">2.</p>
          {step2Icon && (
            <img
              src={step2Icon}
              alt=""
              className="w-28 h-28 object-contain opacity-80 mb-12"
            />
          )}
          <p className="text-sm text-gray-700 max-w-xs mb-12 font-medium">
            {step2Desc}
          </p>
        </div>

        {/* STEP 3 */}
        <div className="flex flex-col items-center justify-end md:pl-10">
          <p className="text-lg font-semibold mb-12">3.</p>
          {step3Icon && (
            <img
              src={step3Icon}
              alt=""
              className="w-28 h-28 object-contain opacity-80 mb-12"
            />
          )}
          <p className="text-sm text-gray-700 max-w-xs mb-12 font-medium">
            {step3Desc}
          </p>
        </div>
      </div>
    </section>
  );
}

function VideoBGSection({product}) {
  const video = product.metafield_bg_video?.reference;

  if (!video?.sources) {
    console.log('Video not ready', video);
    return null;
  }

  const mp4Sources = video.sources.filter((s) => s.mimeType === 'video/mp4');

  // fallback for safari
  const hlsSource = video.sources.find(
    (s) => s.mimeType === 'application/x-mpegURL',
  );

  return (
    <section className="relative w-full h-screen overflow-hidden">
      <video
        autoPlay
        muted
        loop
        playsInline
        controls
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
      >
        {mp4Sources.map((source, i) => (
          <source key={i} src={source.url} type={source.mimeType} />
        ))}

        {/* Use m3u8 ONLY if Safari supports it */}
        {hlsSource && (
          <source src={hlsSource.url} type="application/x-mpegURL" />
        )}
      </video>
      <div className="absolute inset-0 bg-black/20"></div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* 🟣 GRAPHQL PRODUCT QUERY WITH METAFIELDS                                   */
/* -------------------------------------------------------------------------- */

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice { amount currencyCode }
    id
    image { id url altText width height }
    price { amount currencyCode }
    product { title handle }
    selectedOptions { name value }
    sku
    title
    unitPrice { amount currencyCode }
  }
`;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description

    # 🟢 Custom metafields for Hero Section
    metafield_header_text_left_1: metafield(namespace: "product", key: "header_text_left_1") { value }
    metafield_header_text_left_2: metafield(namespace: "product", key: "header_text_left_2") { value }
    metafield_header_text_right_1: metafield(namespace: "product", key: "header_text_right_1") { value }
    metafield_header_text_right_2: metafield(namespace: "product", key: "header_text_right_2") { value }
    metafield_page_description: metafield(namespace: "product", key: "page_description") { value }
    metafield_page_description_2: metafield(namespace: "product", key: "page_description_2") { value }
    metafield_page_description_heading: metafield(namespace: "product", key: "page_descripiton_heading") { value }
    metafield_page_bg_color: metafield(namespace: "product", key: "page_bg_color") { value }
    product_preparation_one_icon: metafield(namespace: "product", key: "preparation_one_icon") {
  reference {
    ... on MediaImage {
      image { url altText }
    }
  }
}
product_preparation_two_icon: metafield(namespace: "product", key: "preparation_two_icon") {
  reference {
    ... on MediaImage {
      image { url altText }
    }
  }
}
product_preparation_three_icon: metafield(namespace: "product", key: "preparation_three_icon") {
  reference {
    ... on MediaImage {
      image { url altText }
    }
  }
}

product_preparation_one_desc: metafield(namespace: "product", key: "preparation_one_desc") { value }
product_preparation_two_desc: metafield(namespace: "product", key: "preparation_two_desc") { value }
product_preparation_three_desc: metafield(namespace: "product", key: "preparation_three_desc") { value }

metafield_preparation_bg_color: metafield(namespace: "product", key: "preparation_bg_color") { value }
metafield_bg_video: metafield(namespace: "product", key: "bg_video") {
  reference {
    __typename
    ... on Video {
      sources {
        format
        height
        mimeType
        url
        width
      }
    }
  }
}


    metafield_hero_image: metafield(namespace: "product", key: "hero_image") {
      reference {
        ... on MediaImage {
          image { url width height altText }
        }
      }
    }

    metafield_header_logo: metafield(namespace: "product", key: "header_logo") {
      reference {
        ... on MediaImage {
          image { url width height altText }
        }
      }
    }

    encodedVariantExistence
    encodedVariantAvailability

    options {
      name
      optionValues {
        name
        firstSelectableVariant { ...ProductVariant }
        swatch {
          color
          image { previewImage { url } }
        }
      }
    }

    selectedOrFirstAvailableVariant(
      selectedOptions: $selectedOptions,
      ignoreUnknownOptions: true,
      caseInsensitiveMatch: true
    ) { ...ProductVariant }

    adjacentVariants(selectedOptions: $selectedOptions) { ...ProductVariant }

    seo { description title }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
`;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
`;

const HOMEPAGE_METAFIELDS_QUERY = `#graphql
  query ProductShowcaseMetafields {
    page(handle: "home") {
      metafields(identifiers: [
        { namespace: "custom", key: "day_product" },
        { namespace: "custom", key: "night_product" },
        { namespace: "custom", key: "day_product_bg" },
        { namespace: "custom", key: "night_product_bg" },
        { namespace: "custom", key: "day_other_bg" },
        { namespace: "custom", key: "night_other_bg" }
      ]) {
        key
        value
        reference {
          ... on Product {
            id
            title
            handle
            descriptionHtml   
            images(first: 1) {
              nodes { url }
            }
            seo { title description }
          }
          ... on MediaImage {
            id
            image {
              url
              altText
              width
              height
            }
          }
        }
      }
    }
  }
`;
// Add this new query to your product page file
const FOOTER_QUERY = `#graphql
  query FooterQuery {
    shop {
      metafields(identifiers: [
        { namespace: "footer", key: "headline" },
        { namespace: "footer", key: "copyright" },
        { namespace: "footer", key: "bg" },
        { namespace: "footer", key: "logo" },
        { namespace: "footer", key: "links" }
      ]) {
        key
        value
        reference {
          __typename
          ... on MediaImage {
            image { url }
          }
        }
        references(first: 25) { 
          nodes {
            __typename
            ... on Page { handle title }
          }
        }
      }
    }
  }
`;

/** @typedef {import('./+types/products.$handle').Route} Route */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
