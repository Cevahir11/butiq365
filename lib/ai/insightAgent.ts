type InsightInput = {
  totalOrdersToday: number;
  pickupOrders: number;
  courierOrders: number;
  lowStockProducts: string[];
  bestSellingCategory: string;
};

export async function insightAgent(data: InsightInput) {
  const insights: string[] = [];

  if (data.pickupOrders > data.courierOrders) {
    insights.push("Gel-Al siparişleri bugün kurye siparişlerinden daha fazla. Mağaza teslim hazırlığını artırmanız önerilir.");
  }

  if (data.lowStockProducts.length > 0) {
    insights.push(`${data.lowStockProducts.join(", ")} ürünlerinin stoğu azaldı. Toptancı siparişi için hazırlık yapılabilir.`);
  }

  if (data.bestSellingCategory) {
    insights.push(`Bugün en çok ${data.bestSellingCategory} kategorisi satıldı. Bu kategoriyi vitrinde öne çıkarabilirsiniz.`);
  }

  return {
    summary: `Bugün toplam ${data.totalOrdersToday} sipariş var.`,
    insights,
  };
}