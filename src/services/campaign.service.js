export async function getCampaignBySlug(slug) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/campaigns/${slug}`,
      { cache: "no-store" }
    );
  
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Error fetching campaign:", error);
    return null;
  }
}