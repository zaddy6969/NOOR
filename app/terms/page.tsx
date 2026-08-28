import type { Metadata } from "next";
import TrustPage from "../trust/TrustPage";

export const metadata: Metadata = { title: "Terms of Use", description: "Terms and important limits for using NOOR's educational tools.", alternates: { canonical: "/terms" } };

export default function TermsPage() {
  return <TrustPage title="Terms of Use" kicker="USE NOOR WITH CARE" intro="By using NOOR, you understand that its content and calculators are general educational aids, not personal religious, legal, medical or financial advice." sections={[
    { title: "Religious guidance", paragraphs: ["Schools of law and local practice may differ. Confirm personal rulings, uncertain worship, moon-sighting decisions and serious life matters with a qualified scholar who knows your circumstances."] },
    { title: "Calculated tools", paragraphs: ["Prayer times, Hijri dates, Qibla bearings, Zakat estimates and Qaza plans depend on user inputs and calculation methods. Check settings and local trusted announcements before acting."] },
    { title: "Media and rights", paragraphs: ["Quran and media playback may depend on third-party streams and their availability. Attribution does not imply ownership. Users must not copy or redistribute protected recordings through NOOR."] },
    { title: "Community and commerce", points: ["Matrimony is a private draft-account preview; public matching and messaging are closed.", "The product catalogue has no sellers, prices, stock, orders, delivery or payment collection.", "Mosque and destination data may be incomplete; confirm details directly before travel."] },
    { title: "Acceptable use", paragraphs: ["Do not misuse accounts, attempt unauthorized access, upload harmful content or use the service to harass, deceive or expose another person. Access may be limited where required to protect users and the service."] },
  ]} />;
}
