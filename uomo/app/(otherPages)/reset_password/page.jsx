import Footer1 from "@/components/footers/Footer1";

import Header1 from "@/components/headers/Header1";
import ResetPassword from "@/components/otherPages/ResetPassword";
import { resetPasswordMetadata } from "@/lib/seo/pageMetadata";
import React from "react";

export const metadata = resetPasswordMetadata;
export default function ResetPasswordPage() {
  return (
    <>
      <Header1 />
      <main className="page-wrapper">
        <div className="mb-4 pb-4"></div>
        <ResetPassword />
      </main>

      <div className="mb-5 pb-xl-5"></div>
      <Footer1 />
    </>
  );
}
