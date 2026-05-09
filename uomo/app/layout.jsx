import AppShell from "@/components/common/AppShell";
import JsonLd from "@/components/common/JsonLd";

const siteName = "ELITE 7 PIEL";
const siteUrl = "https://elite7piel.com";
const defaultTitle = "Cuidado facial y capilar profesional | ELITE 7 PIEL";
const defaultDescription =
  "Compra productos de cuidado facial, tecnologia estetica en casa y tratamiento capilar profesional en ELITE 7 PIEL.";

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteName,
  url: siteUrl,
  logo: `${siteUrl}/assets/images/logo.png`,
  email: "ventas@elite7piel.com",
  telephone: "+52 5510522299",
  sameAs: [
    "https://www.facebook.com/share/1CRwYJ67Yq/",
    "https://www.instagram.com/invites/contact/?utm_source=ig_contact_invite&utm_medium=copy_link&utm_content=jdpg7j9",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    email: "ventas@elite7piel.com",
    telephone: "+52 5510522299",
    areaServed: "MX",
    availableLanguage: ["es-MX"],
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteName,
  url: siteUrl,
  inLanguage: "es-MX",
  potentialAction: {
    "@type": "SearchAction",
    target: `${siteUrl}/shop?search={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export const metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: siteName,
  title: defaultTitle,
  description: defaultDescription,
  keywords: [
    "cuidado facial Mexico CDMX",
    "tratamiento capilar Mexico CDMX",
    "belleza profesional Mexico CDMX",
    "tecnologia estetica Mexico CDMX",
    "elite 7 piel Mexico CDMX",
  ],
  referrer: "origin-when-cross-origin",
  category: "beauty",
  creator: siteName,
  publisher: siteName,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: siteUrl,
    siteName,
    title: defaultTitle,
    description: defaultDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/assets/images/favicon.png",
    shortcut: "/assets/images/favicon.png",
    apple: "/assets/images/favicon.png",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es-MX">
      <body>
        <JsonLd data={organizationJsonLd} />
        <JsonLd data={websiteJsonLd} />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
