import { CustomerSearchSchema } from "./schemas";

export async function customerAgent(message: string) {
  const text = message.toLowerCase();

  const result = {
    city: text.includes("eskişehir") ? "Eskişehir" : undefined,

    district: text.includes("merkez")
      ? "Merkez"
      : undefined,

    deliveryType:
      text.includes("kurye") ||
      text.includes("teslim") ||
      text.includes("hızlı")
        ? "courier"
        : text.includes("gel al") ||
          text.includes("dükkandan")
        ? "pickup"
        : "any",

    maxDeliveryTimeMinutes:
      text.includes("2 saat") ||
      text.includes("hızlı")
        ? 120
        : undefined,

    color: text.includes("siyah")
      ? "black"
      : text.includes("kırmızı")
      ? "red"
      : undefined,

    size: text.includes("3xl")
      ? "3XL"
      : text.includes("oversize")
      ? "oversize"
      : undefined,

    category: text.includes("tişört")
      ? "t-shirt"
      : text.includes("elbise")
      ? "dress"
      : text.includes("gömlek")
      ? "shirt"
      : undefined,
  };

  return CustomerSearchSchema.parse(result);
}