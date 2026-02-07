import { getCampaignBySlug } from "@/services/campaign.service";
import CampaignHero from "@/components/campaign/CampaignHero";
import CampaignProducts from "@/components/campaign/CampaignProducts";
import CampaignExpired from "@/components/campaign/CampaignExpired";
import CampaignCountdown from "@/components/campaign/CampaignCountdown";
import CampaignBanner from "@/components/campaign/CampaignBanner";
import { isCampaignExpired } from "@/utils/date";
import { shopAPI } from "@/utils/api";
import "@/styles/campaign.css";

// Enhanced Mock data logic
const getMockCampaign = (slug) => {
  if (slug === 'valentine-special') {
    return {
      title: "Valentine's Special",
      subtitle: "Exclusive curation for your loved ones.",
      bannerImage: "/hero/1.jpeg",
      themeColor: "#ff4d6d",
      endDate: "2026-02-15T23:59:59Z",
      ctaText: "Shop The Edit",
      promoText: "LOVE IS IN THE AIR • FLAT 20% OFF • ",
      shopSlug: "under-299", // Using existing shop for real products
      banners: [
        { text: "LIMITED TIME OFFER • FREE DELIVERY • ", bgColor: "#333" },
        { text: "NEW ARRIVALS EVERY WEEK • ", bgColor: "#ff4d6d" }
      ]
    };
  }
  return null;
};

export default async function CampaignPage({ params }) {
  const { slug } = params;
  
  // 1. Fetch Campaign Metadata
  let campaign = await getCampaignBySlug(slug);
  if (!campaign) campaign = getMockCampaign(slug);

  if (!campaign) return <CampaignExpired />;
  if (isCampaignExpired(campaign.endDate)) return <CampaignExpired />;

  // 2. Fetch Real Products if shopSlug is present
  let products = campaign.products || [];
  if (campaign.shopSlug) {
    try {
      const shopResponse = await shopAPI.getProducts(campaign.shopSlug, { limit: 12 });
      if (shopResponse?.success) {
        products = shopResponse.data;
      }
    } catch (err) {
      console.error("Failed to fetch products for campaign:", err);
    }
  }

  const themeStyle = {
    '--theme-color': campaign.themeColor || '#000',
    '--theme-bg-soft': `${campaign.themeColor}10` || '#f3f4f6'
  };

  return (
    <main className="min-h-screen bg-white pb-20 overflow-x-hidden" style={themeStyle}>
      {/* Hero Section */}
      <CampaignHero campaign={campaign} />
      
      {/* Optional Top Banner */}
      {campaign.banners?.[0] && (
        <CampaignBanner text={campaign.banners[0].text} bgColor={campaign.banners[0].bgColor} />
      )}

      {/* Product Grid (Horizontal Row) */}
      <CampaignProducts products={products} themeColor={campaign.themeColor} />

      {/* Action Area / Countdown */}
      <div className="py-20 bg-stone-100 flex items-center justify-center">
        <div className="max-w-xl w-full px-4">
          <p className="text-center text-stone-500 uppercase tracking-widest text-sm mb-6">Offer Ends In</p>
          <CampaignCountdown endDate={campaign.endDate} />
        </div>
      </div>

      {/* Promotional Mid Banner */}
      {campaign.promoText && (
        <CampaignBanner text={campaign.promoText} bgColor={campaign.themeColor} />
      )}

      {/* Additional Banners */}
      {campaign.banners?.slice(1).map((banner, index) => (
        <CampaignBanner key={index} text={banner.text} bgColor={banner.bgColor} />
      ))}
    </main>
  );
}
