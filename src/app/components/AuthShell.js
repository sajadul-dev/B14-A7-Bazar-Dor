import Image from "next/image";
import Link from "next/link";

import CurrentDate from "./CurrentDate";

const API_BASE =
  "https://openapi.programming-hero.com/api/bazardor";

async function getApiData(endpoint) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();

    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error(`BazarDor API error (${endpoint}):`, error);
    return [];
  }
}

function bnNumber(value) {
  return new Intl.NumberFormat("bn-BD", {
    maximumFractionDigits: 1,
  }).format(Number(value) || 0);
}

function getDirection(product) {
  if (product.change?.dir === "up") return "up";
  if (product.change?.dir === "down") return "down";

  const today = Number(product.today) || 0;
  const yesterday = Number(product.yesterday) || 0;

  if (today > yesterday) return "up";
  if (today < yesterday) return "down";

  return "neutral";
}

function getPercentage(product) {
  const percentage = product.change?.pct;

  if (
    percentage !== undefined &&
    percentage !== null &&
    Number.isFinite(Number(percentage))
  ) {
    return Math.abs(Number(percentage));
  }

  const today = Number(product.today) || 0;
  const yesterday = Number(product.yesterday) || 0;

  if (!yesterday) return 0;

  return (Math.abs(today - yesterday) / yesterday) * 100;
}

function PriceTicker({ products }) {
  const items = products.slice(0, 12);

  if (items.length === 0) return null;

  return (
    <div
      className="overflow-hidden border-y border-line bg-white"
      aria-label="পণ্যের দাম পরিবর্তনের তথ্য"
    >
      <div className="ticker-track">
        {[0, 1].map((copy) => (
          <div
            key={copy}
            className="flex shrink-0 items-center"
            aria-hidden={copy === 1 ? "true" : undefined}
          >
            {items.map((product) => {
              const direction = getDirection(product);

              const color =
                direction === "up"
                  ? "text-red-600"
                  : direction === "down"
                    ? "text-green-700"
                    : "text-gray-500";

              return (
                <div
                  key={`${copy}-${product.id}`}
                  className="flex shrink-0 items-center gap-2 border-r border-line px-3 py-2.5 text-[10px] sm:px-4 sm:text-xs"
                >
                  <span>
                    {product.image || product.categoryIcon || "🛒"}
                  </span>

                  <span className="font-medium text-ink">
                    {product.nameBn}
                  </span>

                  <span className="text-muted">
                    {bnNumber(product.today)} টাকা
                  </span>

                  <span className={`font-bold ${color}`}>
                    {direction === "up"
                      ? "▲"
                      : direction === "down"
                        ? "▼"
                        : "—"}{" "}
                    {bnNumber(getPercentage(product))}%
                  </span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function AuthShell({
  children,
  activePage,
}) {
  const [categories, products] = await Promise.all([
    getApiData("/categories"),
    getApiData("/products"),
  ]);

  return (
    <div className="flex min-h-screen flex-col bg-page text-ink">
      {/* BRAND HEADER */}
      <header className="sticky top-0 z-50 border-b border-line bg-white">
        <div className="border-b border-gray-100">
          <div className="bazar-container flex min-h-[58px] items-center justify-between gap-3 py-2 sm:min-h-[66px]">
            <Link
              href="/"
              className="flex min-w-0 items-center gap-2.5"
              aria-label="বাজার দর হোম পেজ"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-bazar-green sm:h-10 sm:w-10">
                <Image
                  src="/logo-icon.png"
                  alt="বাজার দর"
                  width={25}
                  height={25}
                  priority
                  className="h-6 w-6 object-contain brightness-0 invert"
                />
              </span>

              <span className="min-w-0">
                <span className="block text-base font-extrabold leading-tight text-ink sm:text-lg">
                  বাজার দর
                </span>

                <span className="mt-0.5 block text-[9px] text-muted sm:text-[10px]">
                  <CurrentDate />
                </span>
              </span>
            </Link>

            <div className="flex shrink-0 items-center gap-2">
              <Link
                href="/signin"
                aria-current={
                  activePage === "signin" ? "page" : undefined
                }
                className={`rounded-lg px-2 py-2 text-[10px] font-semibold sm:px-3 sm:text-xs ${
                  activePage === "signin"
                    ? "text-bazar-green"
                    : "text-ink hover:text-bazar-green"
                }`}
              >
                সাইন ইন
              </Link>

              <Link
                href="/signup"
                aria-current={
                  activePage === "signup" ? "page" : undefined
                }
                className={`rounded-lg px-3 py-2 text-[10px] font-bold transition sm:px-4 sm:text-xs ${
                  activePage === "signup"
                    ? "bg-bazar-green text-white shadow-sm"
                    : "border border-line bg-white text-ink hover:bg-bazar-green hover:text-white"
                }`}
              >
                সাইন আপ
              </Link>
            </div>
          </div>
        </div>

        {/* CATEGORY NAVIGATION */}
        <nav
          className="border-b border-gray-100"
          aria-label="পণ্যের ক্যাটাগরি"
        >
          <div className="bazar-container">
            <div className="flex items-center gap-1 overflow-x-auto py-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:py-2">
              {categories.map((category) => (
                <Link
                  key={category.id || category.slug}
                  href={`/category/${category.slug}`}
                  className="flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1.5 text-[10px] font-semibold text-ink transition hover:bg-bazar-green hover:text-white sm:gap-1.5 sm:px-3 sm:text-xs"
                >
                  <span>{category.icon || "🛒"}</span>

                  <span>{category.nameBn}</span>
                </Link>
              ))}
            </div>
          </div>
        </nav>

        {/* INFINITE PRICE TICKER */}
        <PriceTicker products={products} />
      </header>

      {/* AUTH FORM */}
      <main className="bazar-container flex flex-1 justify-center py-6 sm:py-7">
        <div className="w-full">
          {children}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="mt-auto border-t border-line bg-white">
        <div className="bazar-container flex flex-col justify-between gap-2 py-4 text-center text-[9px] leading-5 text-muted sm:flex-row sm:items-center sm:text-left sm:text-[10px]">
          <p>
            বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে।
          </p>

          <p>
            সকল দাম স্বাভাবিক; বাজারের অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।
          </p>
        </div>
      </footer>
    </div>
  );
}