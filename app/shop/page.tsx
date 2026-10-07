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
        <div><h1>Product Ideas</h1></div>
        <p>Save product ideas to a private list. Shopping and payments are unavailable.</p>
      </section>
      <ShopCatalog />
      <SiteFooter />
    </main>
  );
}
