import {Await, useLoaderData, Link} from 'react-router';
import {Suspense} from 'react';
import {Image} from '@shopify/hydrogen';
import {ProductItem} from '~/components/ProductItem';
import Hero from '~/components/Hero';
import About from '~/components/About';
import MiddleVideo from '~/components/MiddleVideo';
import ProductShowcase from '~/components/ProductShowcase';
import FeaturedProduct from '~/components/FeaturedProduct';
import Principles from '~/components/Principles';

/**
 * @type {Route.MetaFunction}
 */
export const meta = () => {
  return [{title: 'Hydrogen | Home'}];
};

/**
 * @param {Route.LoaderArgs} args
 */


export async function loader({ context }) {
  const [
    { collections },
    heroData,
    aboutData,
    recommendedProducts,
    middleData,
    productShowcaseData,
    featuredProductData,
    principlesData
  ] = await Promise.all([
    context.storefront.query(FEATURED_COLLECTION_QUERY),
    context.storefront.query(HERO_QUERY),
    context.storefront.query(ABOUT_QUERY),
    context.storefront.query(RECOMMENDED_PRODUCTS_QUERY).catch(() => null),
    context.storefront.query(MIDDLE_QUERY),
    context.storefront.query(PRODUCT_SHOWCASE_QUERY), // <-- added this
    context.storefront.query(FEATURED_PRODUCT_QUERY),
    context.storefront.query(PRINCIPLES_QUERY),
  ]);

  return {
    featuredCollection: collections.nodes[0],
    recommendedProducts,
    heroPage: heroData?.page || null,
    aboutPage: aboutData?.page || null,
    middlePage: middleData?.page || null,
    productShowcasePage: productShowcaseData?.page || null,
    featuredProductPage: featuredProductData?.page || null,
    principlesPage: principlesData?.page || null,
  };
}


/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 * @param {Route.LoaderArgs}
 */
async function loadCriticalData({context}) {
  const [{collections}] = await Promise.all([
    context.storefront.query(FEATURED_COLLECTION_QUERY),
    // Add other queries here, so that they are loaded in parallel
  ]);

  return {
    featuredCollection: collections.nodes[0],
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 * @param {Route.LoaderArgs}
 */
function loadDeferredData({context}) {
  const recommendedProducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY)
    .catch((error) => {
      // Log query errors, but don't throw them so the page can still render
      console.error(error);
      return null;
    });

  return {
    recommendedProducts,
  };
}

export default function Homepage() {
  /** @type {LoaderReturnData} */
  const data = useLoaderData();
  return (
    <div className="home">
      <Hero page={data.heroPage} />
      <About page={data.aboutPage}/>
      <MiddleVideo page={data.middlePage} />
      <ProductShowcase page={data.productShowcasePage} />
      <FeaturedProduct page={data.featuredProductPage} />
      <Principles page={data.principlesPage} />
      <FeaturedCollection collection={data.featuredCollection} />
      <RecommendedProducts products={data.recommendedProducts} />
    </div>
  );
}

/**
 * @param {{
 *   collection: FeaturedCollectionFragment;
 * }}
 */
function FeaturedCollection({collection}) {
  if (!collection) return null;
  const image = collection?.image;
  return (
    <Link
      className="featured-collection"
      to={`/collections/${collection.handle}`}
    >
      {image && (
        <div className="featured-collection-image">
          <Image data={image} sizes="100vw" />
        </div>
      )}
      <h1>{collection.title}</h1>
    </Link>
  );
}

/**
 * @param {{
 *   products: Promise<RecommendedProductsQuery | null>;
 * }}
 */
function RecommendedProducts({products}) {
  return (
    <div className="recommended-products">
      <h2>Recommended Products</h2>
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={products}>
          {(response) => (
            <div className="recommended-products-grid">
              {response
                ? response.products.nodes.map((product) => (
                    <ProductItem key={product.id} product={product} />
                  ))
                : null}
            </div>
          )}
        </Await>
      </Suspense>
      <br />
    </div>
  );
}

const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    image {
      id
      url
      altText
      width
      height
    }
    handle
  }
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
`;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    featuredImage {
      id
      url
      altText
      width
      height
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 4, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
`;
const HERO_QUERY = `#graphql
  query HeroSection {
    page(handle: "home") {
      id
      title
      metafields(identifiers: [
        {namespace: "hero", key: "image"},
        {namespace: "hero", key: "logo"},
        {namespace: "hero", key: "subheadingleft"},
        {namespace: "hero", key: "subheadingright"},
        {namespace: "hero", key: "subheadingright2"},
        {namespace: "hero", key: "subheadingleft2"}
      ]) {
        key
        value
        type
        reference {
          ... on MediaImage {
            image {
              url
              altText
            }
          }
        }
      }
    }
  }
`;
const ABOUT_QUERY = `#graphql
  query AboutSection {
    page(handle: "home") {
      id
      title
      metafields(identifiers: [
        {namespace: "about", key: "heading"},
        {namespace: "about", key: "desc"},
        {namespace: "about", key: "logo"},
        {namespace: "about", key: "bgcolor"},
        {namespace: "about", key: "bgimage"}
      ]) {
        key
        value
        type
        reference {
          ... on MediaImage {
            image {
              url
              altText
            }
          }
        }
      }
    }
  }
`;
const MIDDLE_QUERY = `#graphql
  query MiddleSection {
    page(handle: "home") {
      id
      title
      metafields(identifiers: [
        {namespace: "mid", key: "bgvideo"}
      ]) {
        key
        type
        reference {
          ... on Video {
            sources {
              url
              mimeType
              format
              height
              width
            }
            previewImage {
              url
            }
          }
        }
      }
    }
  }
`;
const PRODUCT_SHOWCASE_QUERY = `#graphql
  query ProductShowcase {
    page(handle: "home") {
      id
      metafields(identifiers: [
        { namespace: "custom", key: "day_product" },
        { namespace: "custom", key: "night_product" },
        { namespace: "custom", key: "day_product_bg" },
        { namespace: "custom", key: "night_product_bg" },
        { namespace: "custom", key: "day_other_bg" },
        { namespace: "custom", key: "night_other_bg" }
      ]) {
        key
        reference {
          ... on Product {
            id
            handle
            title
            descriptionHtml
            images(first: 1) {
              nodes {
                url
                altText
                width
                height
              }
            }
          }
          ... on MediaImage {
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
const FEATURED_PRODUCT_QUERY = `#graphql
  query FeaturedProduct {
    page(handle: "home") {
      id
      metafields(identifiers: [
        { namespace: "custom", key: "featured_product" },
        { namespace: "custom", key: "featured_product_text1" },
        { namespace: "custom", key: "featured_product_text2" },
        { namespace: "custom", key: "featured_product_text3" }
      ]) {
        key
        value
        reference {
          ... on MediaImage {
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
const PRINCIPLES_QUERY = `#graphql
  query Principles {
    page(handle: "home") {
      id
      metafields(identifiers: [
        { namespace: "principal", key: "heading_left" },
        { namespace: "principal", key: "desc_left" },
        { namespace: "principal", key: "image_left" },
        { namespace: "principal", key: "heading_center" },
        { namespace: "principal", key: "desc_center" },
        { namespace: "principal", key: "image_center" },
        { namespace: "principal", key: "heading_right" },
        { namespace: "principal", key: "desc_right" },
        { namespace: "principal", key: "image_right" },
        { namespace: "principal", key: "bgcolor" }
      ]) {
        key
        value
        reference {
          ... on MediaImage {
            image {
              url
              altText
            }
          }
        }
      }
    }
  }
`;
const FOOTERHEADER_QUERY = `#graphql
  query FOOTERHEADER {
    page(handle: "home") {
      id
      metafields(identifiers: [
        { namespace: "custom", key: "footer_header" },
        { namespace: "custom", key: "footer_header_bg" },
      ]) {
        key
        value
        reference {
          ... on MediaImage {
            image {
              url
              altText
            }
          }
        }
      }
    }
  }
`;



/** @typedef {import('./+types/_index').Route} Route */
/** @typedef {import('storefrontapi.generated').FeaturedCollectionFragment} FeaturedCollectionFragment */
/** @typedef {import('storefrontapi.generated').RecommendedProductsQuery} RecommendedProductsQuery */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */

