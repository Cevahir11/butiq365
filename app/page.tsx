"use client";

import { useState } from "react";
import { products } from "@/lib/mockData";

export default function Home() {
  const [customerMessage, setCustomerMessage] = useState("");
  const [sellerMessage, setSellerMessage] = useState("");
  const [filters, setFilters] = useState<any>(null);
  const [sellerResult, setSellerResult] = useState<any>(null);
  const [notification, setNotification] = useState("");
  const [loading, setLoading] = useState(false);

  const [filteredProducts, setFilteredProducts] = useState(products);

  const [chatMessages, setChatMessages] = useState<
    {
      role: "user" | "assistant";
      content: string;
    }[]
  >([]);

  async function handleSearch() {
    setLoading(true);

    const res = await fetch("/api/ai/customer-search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: customerMessage,
      }),
    });

    const data = await res.json();

    setFilters(data.filters);

    const result = products.filter((product) => {
      if (data.filters.city && product.city !== data.filters.city)
        return false;

      if (
        data.filters.category &&
        product.category !== data.filters.category
      )
        return false;

      if (data.filters.color && product.color !== data.filters.color)
        return false;

      if (data.filters.size && product.size !== data.filters.size)
        return false;

      return true;
    });

    setFilteredProducts(result);

    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          role: "user",
          content: customerMessage,
        },
        {
          role: "assistant",
          content: `${result.length} uygun ürün buldum. Filtreler başarıyla uygulandı.`,
        },
      ]);

      setLoading(false);
    }, 1200);

    setCustomerMessage("");
  }

  async function handleSellerStock() {
    const res = await fetch("/api/ai/seller-stock", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: sellerMessage,
      }),
    });

    const data = await res.json();

    setSellerResult(data.stock);
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8 text-gray-900">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 rounded-3xl bg-black p-8 text-white shadow-lg">
          <h1 className="text-5xl font-bold">butiq365</h1>

          <p className="mt-3 max-w-3xl text-gray-300">
            AI destekli hyper-local butik marketplace deneyimi.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <section className="rounded-3xl bg-white p-6 shadow-lg lg:col-span-2">
            <h2 className="mb-4 text-2xl font-semibold">
              Customer AI Assistant
            </h2>

            <div className="mb-4 h-72 overflow-auto rounded-2xl bg-gray-100 p-4">
              {chatMessages.length === 0 && (
                <p className="text-gray-400">
                  AI sohbet burada görünecek...
                </p>
              )}

              <div className="space-y-4">
                {chatMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={`max-w-[80%] rounded-2xl p-3 ${
                      msg.role === "user"
                        ? "ml-auto bg-black text-white"
                        : "bg-white shadow"
                    }`}
                  >
                    {msg.content}
                  </div>
                ))}
              </div>

              {loading && (
                <div className="mt-4 inline-block rounded-2xl bg-white px-4 py-3 shadow">
                  🤖 AI analiz ediyor...
                </div>
              )}
            </div>

            <textarea
              className="mb-4 h-28 w-full rounded-xl border p-4 outline-none focus:border-black"
              placeholder="Örn: Eskişehir merkezde hızlı teslim siyah oversize gömlek göster"
              value={customerMessage}
              onChange={(e) =>
                setCustomerMessage(e.target.value)
              }
            />

            <button
              onClick={handleSearch}
              className="rounded-xl bg-black px-5 py-3 text-white transition hover:bg-gray-800"
            >
              AI ile Ara
            </button>

            {filters && (
              <pre className="mt-6 overflow-auto rounded-xl bg-gray-900 p-4 text-sm text-green-300">
                {JSON.stringify(filters, null, 2)}
              </pre>
            )}
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-2xl font-semibold">
              Hyper-local Map Mock
            </h2>

            <div className="relative h-72 overflow-hidden rounded-2xl bg-gradient-to-br from-blue-100 to-green-100">
              <div className="absolute left-8 top-8 rounded-full bg-black px-3 py-1 text-xs text-white">
                Sen
              </div>

              <div className="absolute left-24 top-24 rounded-full bg-white px-3 py-2 text-sm shadow">
                👔 Moda Eskişehir
              </div>

              <div className="absolute bottom-12 left-12 rounded-full bg-white px-3 py-2 text-sm shadow">
                👗 Trend Butik
              </div>

              <div className="absolute right-8 top-36 rounded-full bg-white px-3 py-2 text-sm shadow">
                👕 Street Wear
              </div>
            </div>
          </section>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <section className="rounded-3xl bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-2xl font-semibold">
              Seller Stock AI
            </h2>

            <textarea
              className="mb-4 h-32 w-full rounded-xl border p-4 outline-none focus:border-black"
              placeholder="Örn: Bugün 5 tane M beden kırmızı elbise geldi"
              value={sellerMessage}
              onChange={(e) =>
                setSellerMessage(e.target.value)
              }
            />

            <button
              onClick={handleSellerStock}
              className="rounded-xl bg-black px-5 py-3 text-white transition hover:bg-gray-800"
            >
              Stok JSON Üret
            </button>

            {sellerResult && (
              <pre className="mt-6 overflow-auto rounded-xl bg-gray-900 p-4 text-sm text-green-300">
                {JSON.stringify(sellerResult, null, 2)}
              </pre>
            )}
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-2xl font-semibold">
              AI Insight
            </h2>

            <div className="rounded-2xl bg-black p-5 text-white">
              <p className="text-lg font-semibold">
                Büyük beden ürünlere talep arttı.
              </p>

              <p className="mt-3 text-sm text-gray-300">
                Son 7 günde Gel-Al siparişlerinde artış gözlemlendi.
              </p>
            </div>
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-2xl font-semibold">
              Günlük Operasyon
            </h2>

            <div className="space-y-4">
              <div className="rounded-2xl bg-gray-100 p-4">
                <p className="text-sm text-gray-500">
                  Kurye siparişi
                </p>

                <p className="text-3xl font-bold">12</p>
              </div>

              <div className="rounded-2xl bg-gray-100 p-4">
                <p className="text-sm text-gray-500">
                  Gel-Al müşteri
                </p>

                <p className="text-3xl font-bold">3</p>
              </div>
            </div>
          </section>
        </div>

        {notification && (
          <div className="mt-8 rounded-3xl bg-green-100 p-5 text-green-900 shadow">
            <p className="font-semibold">
              Mock WhatsApp Notification
            </p>

            <p className="mt-1">{notification}</p>
          </div>
        )}

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="overflow-hidden rounded-3xl bg-white shadow-lg transition hover:scale-[1.02]"
            >
              <div className="flex h-56 items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 text-7xl">
                {product.image}
              </div>

              <div className="p-5">
                <h3 className="text-2xl font-bold">
                  {product.name}
                </h3>

                <p className="mt-1 text-gray-500">
                  {product.boutique}
                </p>

                <p className="mt-1 text-sm text-gray-400">
                  {product.district} • {product.distance}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-black px-3 py-1 text-xs text-white">
                    {product.color}
                  </span>

                  <span className="rounded-full bg-gray-200 px-3 py-1 text-xs">
                    {product.size}
                  </span>

                  {product.deliveryType === "courier" ? (
                    <span className="rounded-full bg-green-500 px-3 py-1 text-xs text-white">
                      ⚡ {product.deliveryTime} dk teslim
                    </span>
                  ) : (
                    <span className="rounded-full bg-blue-500 px-3 py-1 text-xs text-white">
                      🏪 Gel-Al Hazır
                    </span>
                  )}
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <p className="text-3xl font-bold">
                    ₺{product.price}
                  </p>

                  <button
                    onClick={() =>
                      setNotification(
                        product.deliveryType === "courier"
                          ? `WhatsApp bildirimi hazır: Siparişiniz ${product.boutique} tarafından ${product.deliveryTime} dk içinde teslim edilecek.`
                          : `WhatsApp bildirimi hazır: Siparişiniz ${product.boutique} mağazasında Gel-Al için hazır.`
                      )
                    }
                    className="rounded-xl bg-black px-4 py-2 text-sm text-white transition hover:bg-gray-800"
                  >
                    İncele
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}