import Blog1 from "@/components/blogs/Blog1";

import Footer1 from "@/components/footers/Footer1";

import Header1 from "@/components/headers/Header1";
import { blogListingMetadata } from "@/lib/seo/pageMetadata";
import React from "react";

export const metadata = blogListingMetadata;
export default function BlogPage1() {
  return (
    <>
      <Header1 />
      <main className="page-wrapper">
        <Blog1 />
      </main>
      <div className="mb-5 pb-xl-5"></div>
      <Footer1 />
    </>
  );
}
