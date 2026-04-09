"use client";

import { useEffect } from "react";
import "react-tooltip/dist/react-tooltip.css";
import "../../public/assets/css/plugins/swiper.min.css";
import "../../public/assets/sass/style.scss";
import "rc-slider/assets/index.css";
import "tippy.js/dist/tippy.css";
import Svgs from "@/components/common/Svgs";
import LoginFormPopup from "@/components/common/LoginFormPopup";
import CookieContainer from "@/components/common/CookieContainer";
import WhatsAppFloat from "@/components/common/WhatsAppFloat";
import ScrollTop from "@/components/common/ScrollTop";
import LocaleRuntime from "@/components/common/LocaleRuntime";
import Context from "@/context/Context";
import QuickView from "@/components/modals/QuickView";
import CartDrawer from "@/components/shopCartandCheckout/CartDrawer";
import SiteMap from "@/components/modals/SiteMap";
import MobileHeader from "@/components/headers/MobileHeader";
import SizeGuide from "@/components/modals/SizeGuide";
import Delivery from "@/components/modals/Delivery";
import CustomerLogin from "@/components/asides/CustomerLogin";
import ShopFilter from "@/components/asides/ShopFilter";
import ProductDescription from "@/components/asides/ProductDescription";
import ProductAdditionalInformation from "@/components/asides/ProductAdditionalInformation";
import ProductReviews from "@/components/asides/ProductReviews";
import MobileFooter1 from "@/components/footers/MobileFooter1";

export default function AppShell({ children }) {
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.esm").catch(() => {});
  }, []);

  return (
    <>
      <LocaleRuntime />
      <Svgs />
      <Context>
        <MobileHeader />
        {children}
        <MobileFooter1 />
        <LoginFormPopup />
        <QuickView />
        <SizeGuide />
        <Delivery />
        <CartDrawer />
        <SiteMap />
        <CustomerLogin />
        <ShopFilter />
        <ProductDescription />
        <ProductAdditionalInformation />
        <ProductReviews />
        <CookieContainer />
        <WhatsAppFloat />
      </Context>
      <div className="page-overlay" id="pageOverlay"></div>
      <ScrollTop />
    </>
  );
}
