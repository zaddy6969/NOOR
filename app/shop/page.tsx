import type { Metadata } from "next";
import SiteFooter from "../site/SiteFooter";
import ToolHeader from "../site/ToolHeader";
import ShopCatalog from "./ShopCatalog";

export const metadata: Metadata = {
  title: "Islamic Product Request Catalogue",
  description: "Browse Islamic products by category and save a private request list. Checkout, pricing and ordering are not active.",
  alternates: { canonical: "/shop" },
};

export default function ShopPage() {
  return (
    <main className="directory-tool-page">
      <ToolHeader title="PRODUCT REQUEST CATALOGUE" subtitle="Browse · Save · No checkout" />
      <section className="compact-directory-intro">
        <div><p>ISLAMIC PRODUCT IDEAS</p><h1>Browse by need.<br/>{" "}<em>Save a private list.</em></h1></div>
        <p>This is a request catalogue, not a live shop. Browse product ideas and save a list on this device; there are no prices, sellers, orders or payment collection.</p>
      </section>
      <ShopCatalog />
      <SiteFooter />
    </main>
  );
}
