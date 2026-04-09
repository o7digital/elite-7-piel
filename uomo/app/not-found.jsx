import React from "react";
import PageNotFound from "./(otherPages)/page-not-found/page";
import { notFoundMetadata } from "@/lib/seo/pageMetadata";

export const metadata = notFoundMetadata;
export default function NotFound() {
  return (
    <>
      <PageNotFound />
    </>
  );
}
