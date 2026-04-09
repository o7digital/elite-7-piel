import Footer1 from "@/components/footers/Footer1";

import Header1 from "@/components/headers/Header1";
import AccountWishlist from "@/components/otherPages/AccountWishlist";
import DashboardSidebar from "@/components/otherPages/DashboardSidebar";
import { accountNoIndexMetadata } from "@/lib/seo/pageMetadata";
import React from "react";

export const metadata = accountNoIndexMetadata;
export default function AccountWishlistPage() {
  return (
    <>
      <Header1 />
      <main className="page-wrapper">
        <div className="mb-4 pb-4"></div>
        <section className="my-account container">
          <h2 className="page-title">Wishlist</h2>
          <div className="row">
            <DashboardSidebar />
            <AccountWishlist />
          </div>
        </section>
      </main>

      <div className="mb-5 pb-xl-5"></div>
      <Footer1 />
    </>
  );
}
