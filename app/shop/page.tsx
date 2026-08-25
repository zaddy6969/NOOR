import type { Metadata } from "next";
import SiteFooter from "../site/SiteFooter";
import ToolHeader from "../site/ToolHeader";
import ShopCatalog from "./ShopCatalog";

export const metadata: Metadata = {
  title: "Islamic Shop by Category | NOOR",
  description: "Browse Quran books, prayer essentials, modest wear, attar, Hajj and Umrah kits, gifts and children’s learning items.",
};

export default function ShopPage() {
  return (
    <main className="directory-tool-page">
      <ToolHeader title="SHOP BY CATEGORY" subtitle="Useful · Clear · Seller-ready" />
      <section className="compact-directory-intro">
        <div><p>ISLAMIC CATALOGUE</p><h1>Useful things,<br/><em>easy to find.</em></h1></div>
        <p>Browse by need, compare options and save a request list. NOOR will enable ordering only after approved sellers, stock and secure payment are connected.</p>
      </section>
      <ShopCatalog />
      <SiteFooter />
    </main>
  );
}
