import {Link} from '@remix-run/react';

// Lifestyle images showing Internal War clothing
const bannerImages = [
  {
    src: 'https://cdn.shopify.com/s/files/1/0640/4082/9110/files/IMG_5512.jpg?v=1732660175',
    alt: 'Person wearing Internal War black hoodie on stairs',
  },
  {
    src: 'https://cdn.shopify.com/s/files/1/0640/4082/9110/files/IMG_5247.jpg?v=1732660176',
    alt: 'Two people wearing Internal War pink collection',
  },
  {
    src: 'https://cdn.shopify.com/s/files/1/0640/4082/9110/files/IMG_5355.jpg?v=1732660175',
    alt: 'Person in Internal War black jacket with urban backdrop',
  },
];

interface HeroBannerProps {
  slogan?: string;
  subtext?: string;
  ctaText?: string;
  ctaLink?: string;
  images?: Array<{src: string; alt: string}>;
}

export default function HeroBanner({
  slogan = 'Fight Your Own War',
  subtext = 'Streetwear for the relentless',
  ctaText = 'Shop Now',
  ctaLink = '/collections',
  images = bannerImages,
}: HeroBannerProps) {
  return (
    <section className="hero-banner">
      {/* Image Grid - Full Width, No Gaps */}
      <div className="hero-banner-images">
        {images.map((image, index) => (
          <div key={index} className="hero-banner-image-container">
            <img
              src={image.src}
              alt={image.alt}
              loading={index === 0 ? 'eager' : 'lazy'}
              fetchPriority={index === 0 ? 'high' : 'low'}
              className="hero-banner-img"
            />
            {/* Individual image tint overlay */}
            <div className="hero-banner-tint" />
          </div>
        ))}
      </div>

      {/* Centered Content Overlay */}
      <div className="hero-banner-content">
        <div className="hero-banner-text">
          <h2 className="hero-banner-slogan">{slogan}</h2>
          {subtext && <p className="hero-banner-subtext">{subtext}</p>}
          {ctaText && ctaLink && (
            <Link to={ctaLink} className="hero-banner-cta">
              {ctaText}
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3.333 8h9.334M9 4.667L12.667 8 9 11.333"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
