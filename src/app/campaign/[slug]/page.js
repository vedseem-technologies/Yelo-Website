import { getCampaignBySlug } from "@/services/campaign.service";
import CampaignHero from "@/components/campaign/CampaignHero";
import CampaignProducts from "@/components/campaign/CampaignProducts";
import CampaignExpired from "@/components/campaign/CampaignExpired";
import CampaignCountdown from "@/components/campaign/CampaignCountdown";
import CampaignBanner from "@/components/campaign/CampaignBanner";
import { isCampaignExpired } from "@/utils/date";
import "@/styles/campaign.css";

// Mock data for initial testing until backend is ready
const getMockCampaign = (slug) => {
  if (slug === 'valentine-special') {
    return {
      title: "Valentine's Special Collection",
      subtitle: "Find the perfect gift for your loved ones with our exclusive curation.",
      bannerImage: "/hero/1.jpeg",
      themeColor: "#ff4d6d",
      endDate: "2026-02-15T23:59:59Z",
      ctaText: "Explore Gifts",
      promoText: "LOVE IS IN THE AIR • FLAT 20% OFF ON ALL GIFT SETS • ",
      products: [
        { id: 1, name: "Silk Satin Robe", brand: "Luxe Home", price: "2,499", image: "/image-the-price-spot/kurta-set.jpg" },
        { id: 2, name: "Velvet Evening Gown", brand: "Yeahlo Exclusive", price: "4,299", image: "/image-the-price-spot/sweatshirt.jpg" },
        { id: 3, name: "Gold Plated Necklace", brand: "Aura Jewels", price: "1,899", image: "/image-the-price-spot/sweater.jpg" },
        { id: 4, name: "Scented Candle Set", brand: "Essence", price: "999", image: "/image-the-price-spot/personal-care-1.jpg" },
      ]
    };
  }
  return null;
};

export default async function CampaignPage({ params }) {
  const { slug } = params;
  
  // Try real API first
  let campaign = await getCampaignBySlug(slug);
  
  // Fallback to mock data for development
  if (!campaign) {
    campaign = getMockCampaign(slug);
  }

  if (!campaign) return <CampaignExpired />;

  if (isCampaignExpired(campaign.endDate)) {
    return <CampaignExpired />;
  }

  return (
    <main className="min-h-screen bg-white">
      <CampaignHero campaign={campaign} />
      <CampaignCountdown endDate={campaign.endDate} />
      <CampaignProducts products={campaign.products} />
      {campaign.promoText && (
        <CampaignBanner text={campaign.promoText} bgColor={campaign.themeColor} />
      )}
      {/* Additional sections can be added here */}
    </main>
  );
}