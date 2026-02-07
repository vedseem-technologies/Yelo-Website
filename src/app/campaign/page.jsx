import CampaignHero from "@/components/campaign/CampaignHero";
import CampaignProducts from "@/components/campaign/CampaignProducts";
import CampaignCountdown from "@/components/campaign/CampaignCountdown";
import CampaignBanner from "@/components/campaign/CampaignBanner";
import { shopAPI } from "@/utils/api";
import "@/styles/campaign.css";

/**
 * SCHEMA DESIGN PROPOSAL (Manual Design for Backend Inspiration)
 * This mock object represents all fields an Admin should be able to control.
 */
const templateCampaign = {
  // --- IDENTIFICATION ---
  slug: "multi-section-edit",
  active: true,
  startDate: "2024-01-01T00:00:00Z",
  endDate: "2026-12-31T23:59:59Z",

  // --- HERO SECTION ---
  title: "The Season of Love",
  subtitle: "Handpicked styles for every romantic moment.",
  bannerImage: "/hero/1.jpeg",
  heroOverlayOpacity: 0.45,
  titleAlignment: "center", 
  
  // --- THEMING ---
  themeColor: "#D63031",
  accentColor: "#FF7675",
  secondaryBg: "#FFF5F5",
  fontFamily: "'Playfair Display', serif",

  // --- COMPONENT-BASED LAYOUT (Ordered Array) ---
  layout: [
    { type: "banner-marquee", text: "VALENTINE'S SPECIAL • FREE GIFT WRAPPING • SHIP WORLDWIDE • ", bgColor: "#D63031", textColor: "#FFFFFF" },
    { type: "spacer", height: "80px" },
    { 
      type: "product-row", 
      title: "Gifts For Her", 
      subtitle: "ROMANTIC CURATION", 
      shopSlug: "affordable", 
      limit: 6 
    },
    { type: "spacer", height: "100px" },
    { 
      type: "image-banner", 
      image: "/hero/2.jpeg", 
      link: "#", 
      height: "450px" 
    },
    { type: "spacer", height: "100px" },
    { 
      type: "product-row", 
      title: "Essential Styles", 
      subtitle: "DAILY COMFORT", 
      shopSlug: "affordable", 
      limit: 6 
    },
    { type: "banner-marquee", text: "BEST SELLERS BACK IN STOCK • SHOP NOW • ", bgColor: "#2D3436", textColor: "#FFFFFF" },
    { type: "spacer", height: "120px" },
    { type: "countdown", title: "Offer Ends In", bgColor: "#FFF5F5" },
    { type: "spacer", height: "80px" },
    { 
      type: "image-banner", 
      image: "/hero/4.jpeg", 
      link: "#", 
      height: "400px" 
    },
    { type: "spacer", height: "100px" },
    { 
      type: "product-grid", 
      title: "Explore Full Collection", 
      subtitle: "ALL DESIGNS", 
      shopSlug: "affordable", 
      limit: 12 
    },
    { type: "spacer", height: "100px" },
    { type: "banner-marquee", text: "FOLLOW US ON INSTAGRAM @YEAHLO • #YEAHLOVIBES • ", bgColor: "#D63031", textColor: "#FFFFFF" }
  ]
};

export default async function CampaignTemplatePage() {
  const campaign = templateCampaign;
  
  // 1. Pre-fetch products for all 'product-row' and 'product-grid' components
  const layoutWithProducts = await Promise.all(
    campaign.layout.map(async (item) => {
      if (item.type === 'product-row' || item.type === 'product-grid') {
        try {
          const shopResponse = await shopAPI.getProducts(item.shopSlug, { limit: item.limit });
          return { ...item, products: shopResponse?.success ? shopResponse.data : [] };
        } catch (err) {
          console.error(`Fetch failed for shop ${item.shopSlug}:`, err);
          return { ...item, products: [] };
        }
      }
      return item;
    })
  );

  const themeStyle = {
    '--theme-color': campaign.themeColor,
    '--accent-color': campaign.accentColor,
    '--secondary-bg': campaign.secondaryBg,
  };

  return (
    <main className="min-h-screen bg-white pb-32 overflow-x-hidden" style={themeStyle}>
      {/* GLOBAL HERO */}
      <CampaignHero campaign={campaign} />
      
      {/* 2. DYNAMIC COMPONENT RENDERER (ORDERED) */}
      <div className="flex flex-col">
        {layoutWithProducts.map((item, index) => {
          switch (item.type) {
            case 'banner-marquee':
              return (
                <CampaignBanner 
                  key={`banner-${index}`} 
                  text={item.text} 
                  bgColor={item.bgColor} 
                  textColor={item.textColor} 
                />
              );
            
            case 'image-banner':
              return (
                <div key={`image-banner-${index}`} className="relative w-full overflow-hidden" style={{ height: item.height }}>
                  <img src={item.image} alt="Campaign Banner" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/10" />
                </div>
              );

            case 'product-row':
            case 'product-grid':
              return (
                <div key={`${item.type}-${index}`} className="py-12 space-y-4">
                  <div className="max-w-7xl mx-auto px-6 text-center">
                    <p className="text-[10px] font-black tracking-[0.5em] uppercase opacity-40 mb-3" style={{ color: campaign.themeColor }}>
                      {item.subtitle}
                    </p>
                    <h2 className="text-4xl md:text-6xl font-serif italic mb-10">
                      {item.title}
                    </h2>
                  </div>
                  <CampaignProducts 
                    products={item.products} 
                    themeColor={campaign.accentColor} 
                    layout={item.type === 'product-grid' ? 'grid' : 'row'}
                  />
                </div>
              );

            case 'countdown':
              return (
                <div key={`countdown-${index}`} className="py-24" style={{ backgroundColor: item.bgColor }}>
                  <div className="max-w-2xl mx-auto px-6 text-center">
                    <h3 className="text-2xl md:text-3xl font-bold mb-10">{item.title}</h3>
                    <CampaignCountdown endDate={campaign.endDate} />
                  </div>
                </div>
              );

            case 'spacer':
              return <div key={`spacer-${index}`} style={{ height: item.height }} className="w-full" />;

            default:
              return null;
          }
        })}
      </div>
    </main>
  );
}
