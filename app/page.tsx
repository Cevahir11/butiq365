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
    { role: "user" | "assistant"; content: string }[]
  >([]);

  async function handleSearch() {
    setLoading(true);

    const res = await fetch("/api/ai/customer-search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: customerMessage }),
    });

    const data = await res.json();
    setFilters(data.filters);

    const result = products.filter((product) => {
      if (data.filters.city && product.city !== data.filters.city) return false;
      if (data.filters.category && product.category !== data.filters.category)
        return false;
      if (data.filters.color && product.color !== data.filters.color)
        return false;
      if (data.filters.size && product.size !== data.filters.size) return false;
      return true;
    });

    setFilteredProducts(result);

    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        { role: "user", content: customerMessage },
        {
          role: "assistant",
          content: `${result.length} ürün bulundu. Yerel butiklere göre filtrelendi.`,
        },
      ]);

      setLoading(false);
    }, 900);

    setCustomerMessage("");
  }

  async function handleSellerStock() {
    const res = await fetch("/api/ai/seller-stock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: sellerMessage }),
    });

    const data = await res.json();
    setSellerResult(data.stock);
  }

  return (
    <main className="min-h-screen bg-[#f5f5f5] text-gray-900">
      <header className="sticky top-0 z-50 border-b bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center gap-6 px-6 py-4">
          <div className="text-3xl font-extrabold text-orange-500">
            butiq365
          </div>

          <div className="flex flex-1 items-center rounded-full border bg-gray-100 px-4 py-3">
            <span className="mr-2 text-gray-400">🔍</span>
            <input
              className="w-full bg-transparent outline-none"
              placeholder="Ürün, butik veya şehir ara"
              value={customerMessage}
              onChange={(e) => setCustomerMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
            />
          </div>

          <button className="text-sm font-semibold">Giriş Yap</button>
          <button className="text-sm font-semibold">Favorilerim</button>
          <button className="rounded-full bg-orange-500 px-4 py-2 text-sm font-bold text-white">
            Sepetim
          </button>
        </div>

        <nav className="mx-auto flex max-w-7xl gap-6 overflow-auto px-6 pb-3 text-sm font-medium">
          <span>Kadın</span>
          <span>Erkek</span>
          <span>Büyük Beden</span>
          <span>Elbise</span>
          <span>Gömlek</span>
          <span>Tişört</span>
          <span>Gel-Al</span>
          <span>2 Saatte Teslim</span>
          <span>Yerel Butikler</span>
        </nav>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <section className="mb-8 rounded-3xl bg-gradient-to-r from-orange-500 to-pink-500 p-8 text-white shadow-lg">
          <p className="text-sm font-semibold uppercase tracking-wide">
            Hyper-local butik pazaryeri
          </p>

          <h1 className="mt-2 text-4xl font-extrabold">
            Bugünkü etkinlik için kıyafetin dakikalar içinde hazır.
          </h1>

          <p className="mt-3 max-w-2xl text-white/90">
            Yerel butiklerden Gel-Al veya yerel kurye ile hızlı teslimat.
            AI asistanına ne istediğini yaz, uygun ürünleri anında bul.
          </p>

          <button
            onClick={handleSearch}
            className="mt-6 rounded-full bg-white px-6 py-3 font-bold text-orange-600"
          >
            AI ile Hemen Ara
          </button>
        </section>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="space-y-5 rounded-3xl bg-white p-5 shadow">
            <h2 className="text-xl font-bold">Filtreler</h2>

            <div>
              <p className="mb-2 font-semibold">Teslimat</p>
              <div className="space-y-2 text-sm">
                <label className="block">
                  <input type="checkbox" className="mr-2" /> 2 saatte teslim
                </label>
                <label className="block">
                  <input type="checkbox" className="mr-2" /> Gel-Al hazır
                </label>
                <label className="block">
                  <input type="checkbox" className="mr-2" /> Yerel kurye
                </label>
              </div>
            </div>

            <div>
              <p className="mb-2 font-semibold">Kategori</p>
              <div className="flex flex-wrap gap-2">
                {["Gömlek", "Elbise", "Tişört", "Ceket"].map((item) => (
                  <span
                    key={item}
                    className="rounded-full bg-gray-100 px-3 py-1 text-sm"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 font-semibold">AI Agent</p>

              <div className="h-52 overflow-auto rounded-2xl bg-gray-100 p-3 text-sm">
                {chatMessages.length === 0 && (
                  <p className="text-gray-400">
                    AI sohbet burada görünecek...
                  </p>
                )}

                <div className="space-y-3">
                  {chatMessages.map((msg, index) => (
                    <div
                      key={index}
                      className={`rounded-2xl p-3 ${
                        msg.role === "user"
                          ? "bg-orange-500 text-white"
                          : "bg-white shadow"
                      }`}
                    >
                      {msg.content}
                    </div>
                  ))}
                </div>

                {loading && (
                  <div className="mt-3 rounded-2xl bg-white p-3 shadow">
                    🤖 AI analiz ediyor...
                  </div>
                )}
              </div>

              {filters && (
                <pre className="mt-3 max-h-48 overflow-auto rounded-2xl bg-gray-900 p-3 text-xs text-green-300">
                  {JSON.stringify(filters, null, 2)}
                </pre>
              )}
            </div>
          </aside>

          <section>
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Yerel Butik Ürünleri</h2>
                <p className="text-sm text-gray-500">
                  {filteredProducts.length} ürün listeleniyor
                </p>
              </div>

              <select className="rounded-xl border bg-white px-4 py-2 text-sm">
                <option>Önerilen sıralama</option>
                <option>En hızlı teslimat</option>
                <option>En düşük fiyat</option>
              </select>
            </div>

            {notification && (
              <div className="mb-6 rounded-3xl bg-green-100 p-5 text-green-900 shadow">
                <p className="font-semibold">Mock WhatsApp Notification</p>
                <p className="mt-1">{notification}</p>
              </div>
            )}

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="group overflow-hidden rounded-3xl bg-white shadow transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative flex h-60 items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 text-7xl">
                    <span>{product.image}</span>

                    <span className="absolute left-3 top-3 rounded-full bg-orange-500 px-3 py-1 text-xs font-bold text-white">
                      Yerel Butik
                    </span>

                    {product.deliveryType === "courier" ? (
                      <span className="absolute bottom-3 left-3 rounded-full bg-green-500 px-3 py-1 text-xs font-bold text-white">
                        ⚡ {product.deliveryTime} dk teslim
                      </span>
                    ) : (
                      <span className="absolute bottom-3 left-3 rounded-full bg-blue-500 px-3 py-1 text-xs font-bold text-white">
                        🏪 Gel-Al Hazır
                      </span>
                    )}
                  </div>

                  <div className="p-5">
                    <p className="text-xs font-semibold text-orange-500">
                      {product.boutique}
                    </p>

                    <h3 className="mt-1 text-lg font-bold">{product.name}</h3>

                    <p className="mt-1 text-sm text-gray-500">
                      {product.district} • {product.distance}
                    </p>

                    <div className="mt-3 flex gap-2">
                      <span className="rounded-full bg-black px-3 py-1 text-xs text-white">
                        {product.color}
                      </span>

                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs">
                        {product.size}
                      </span>
                    </div>

                    <div className="mt-5 flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-400 line-through">
                          ₺{product.price + 250}
                        </p>
                        <p className="text-3xl font-extrabold text-orange-500">
                          ₺{product.price}
                        </p>
                      </div>

                      <button
                        onClick={() =>
                          setNotification(
                            product.deliveryType === "courier"
                              ? `WhatsApp bildirimi hazır: Siparişiniz ${product.boutique} tarafından ${product.deliveryTime} dk içinde teslim edilecek.`
                              : `WhatsApp bildirimi hazır: Siparişiniz ${product.boutique} mağazasında Gel-Al için hazır.`
                          )
                        }
                        className="rounded-full bg-orange-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-orange-600"
                      >
                        Sepete Ekle
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <section className="rounded-3xl bg-white p-6 shadow">
            <h2 className="mb-4 text-xl font-bold">Seller Stock AI</h2>

            <textarea
              className="mb-4 h-32 w-full rounded-xl border p-4 outline-none focus:border-orange-500"
              placeholder="Örn: Bugün 5 tane M beden kırmızı elbise geldi"
              value={sellerMessage}
              onChange={(e) => setSellerMessage(e.target.value)}
            />

            <button
              onClick={handleSellerStock}
              className="rounded-full bg-orange-500 px-5 py-3 font-bold text-white"
            >
              Stok JSON Üret
            </button>

            {sellerResult && (
              <pre className="mt-5 max-h-80 overflow-auto rounded-2xl bg-gray-900 p-4 text-sm text-green-300">
                {JSON.stringify(sellerResult, null, 2)}
              </pre>
            )}
          </section>

          <section className="rounded-3xl bg-white p-6 shadow">
            <h2 className="mb-4 text-xl font-bold">AI Insight</h2>

            <div className="rounded-2xl bg-orange-50 p-5">
              <p className="font-bold text-orange-600">
                Büyük beden ürünlere talep arttı.
              </p>

              <p className="mt-2 text-sm text-gray-600">
                Son 7 günde Gel-Al siparişlerinde 3XL ve oversize ürünler öne
                çıktı. Bu ürünleri vitrinde öne çıkarabilirsiniz.
              </p>
            </div>
          </section>

          <section className="rounded-3xl bg-white p-6 shadow">
            <h2 className="mb-4 text-xl font-bold">Operasyon Özeti</h2>

            <div className="grid gap-3">
              <div className="rounded-2xl bg-gray-100 p-4">
                <p className="text-sm text-gray-500">Kurye siparişi</p>
                <p className="text-3xl font-bold">12</p>
              </div>

              <div className="rounded-2xl bg-gray-100 p-4">
                <p className="text-sm text-gray-500">Gel-Al müşteri</p>
                <p className="text-3xl font-bold">3</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}