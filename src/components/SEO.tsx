import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  noIndex?: boolean;
}

const SEO: React.FC<SEOProps> = ({
  title = 'Sahara-e-Khalq | A Support for Humanity',
  description = 'Sahara-e-Khalq Foundation is dedicated to serving humanity through educational support, food distribution, and healthcare initiatives.',
  keywords = 'foundation, charity, humanity, sahara-e-khalq, non-profit, donation, education, healthcare',
  image = 'https://sahara-e-khalq.vercel.app/logo.png',
  url = typeof window !== 'undefined' ? window.location.href : 'https://sahara-e-khalq.vercel.app',
  type = 'website',
  noIndex = false
}) => {
  const siteTitle = title.includes('Sahara-e-Khalq') ? title : `${title} | Sahara-e-Khalq`;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "NGO",
    "name": "Sahara-e-Khalq Foundation",
    "alternateName": "Sahara-e-Khalq",
    "url": "https://sahara-e-khalq.vercel.app",
    "logo": "https://sahara-e-khalq.vercel.app/logo.png",
    "description": "Sahara-e-Khalq Foundation is dedicated to serving humanity through educational support, food distribution, and healthcare initiatives.",
    "sameAs": [
      "https://www.facebook.com/saharaekhalq",
      "https://www.instagram.com/saharaekhalq"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "",
      "contactType": "customer service",
      "email": "saharaekhalq@gmail.com"
    }
  };

  return (
    <Helmet>
      {/* Standard Meta Tags */}
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      {!noIndex && <meta name="robots" content="index, follow" />}
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

export default SEO;
