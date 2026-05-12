import { SellerStockSchema } from "./schemas";

export async function sellerAgent(message: string) {
  // Şimdilik mock AI.
  // Sonra gerçek AI API ile değiştireceğiz.

  const text = message.toLowerCase();

  const items = [];

  if (text.includes("kırmızı elbise")) {
    items.push({
      name: "Kırmızı Elbise",
      category: "dress",
      color: "red",
      size: text.includes("m beden") ? "M" : undefined,
      quantity: text.includes("5 tane") ? 5 : 1,
    });
  }

  if (text.includes("kot ceket")) {
    items.push({
      name: "Kot Ceket",
      category: "jacket",
      color: "denim",
      size: text.includes("l beden") ? "L" : undefined,
      quantity: text.includes("2 tane") ? 2 : 1,
    });
  }

  return SellerStockSchema.parse({ items });
}