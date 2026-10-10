import Image from "next/image";
import Link from "next/link";
import AccountNavigation from "../../components/AccountNavigation";

import CurrentDate from "../../components/CurrentDate";

const API_BASE =
  "https://openapi.programming-hero.com/api/bazardor";

/* =========================================
   API DATA
========================================= */

async function getApiData(endpoint) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();

    return Array.isArray(data) ? data : null;
  } catch (error) {
    console.error(`BazarDor API error (${endpoint}):`, error);

    return null;
  }
}

/* =========================================
   BENGALI NUMBER FORMATTING
========================================= */

function bnNumber(value, maximumFractionDigits = 2) {
  return new Intl.NumberFormat("bn-BD", {
    maximumFractionDigits,
  }).format(Number(value) || 0);
}

/* =========================================
   PRODUCT PRICE CHANGE
========================================= */

function getDirection(product) {
  if (product.change?.dir === "up") {
    return "up";
  }

  if (product.change?.dir === "down") {
    return "down";
  }

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

  if (yesterday === 0) return 0;

  return (Math.abs(today - yesterday) / yesterday) * 100;
}

function getPriceChangeText(product) {
  const today = Number(product.today) || 0;
  const yesterday = Number(product.yesterday) || 0;

  const difference = Math.abs(today - yesterday);
  const direction = getDirection(product);

  if (direction === "up") {
    return `গতকালের তুলনায় আজ দাম বেড়েছে : ${bnNumber(difference)} টাকা`;
  }

  if (direction === "down") {
    return `গতকালের তুলনায় আজ দাম কমেছে : ${bnNumber(difference)} টাকা`;
  }

  return "গতকালের তুলনায় আজ দামে কোনো পরিবর্তন হয়নি";
}

/* =========================================
   PRODUCT UNIT
========================================= */

function getUnit(unit) {
  const units = {
    kg: "প্রতি কেজি",
    kilogram: "প্রতি কেজি",
    liter: "প্রতি লিটার",
    litre: "প্রতি লিটার",
    l: "প্রতি লিটার",
    piece: "প্রতি পিস",
    pcs: "প্রতি পিস",
    pc: "প্রতি পিস",
    dozen: "প্রতি ডজন",
    gm: "প্রতি গ্রাম",
    g: "প্রতি গ্রাম",
  };

  return (
    units[String(unit || "").toLowerCase()] ||
    `প্রতি ${unit || "ইউনিট"}`
  );
}

function getShortUnit(unit) {
  return getUnit(unit).replace(/^প্রতি\s*/, "");
}

/* =========================================
   MARKET PRICE SUMMARY
========================================= */

function getMarketStats(markets, today) {
  const currentPrice = Number(today) || 0;

  const validMarkets = markets.filter(
    (market) =>
      Number.isFinite(Number(market.min)) &&
      Number.isFinite(Number(market.max))
  );

  if (validMarkets.length === 0) {
    return {
      minimum: currentPrice,
      maximum: currentPrice,
      average: currentPrice,
    };
  }

  const minimum = Math.min(
    ...validMarkets.map((market) => Number(market.min))
  );

  const maximum = Math.max(
    ...validMarkets.map((market) => Number(market.max))
  );

  return {
    minimum,
    maximum,
    average: currentPrice,
  };
}

/* =========================================
   PRICE TICKER
========================================= */

function PriceTicker({ products }) {
  const tickerProducts = products.slice(0, 12);

  if (tickerProducts.length === 0) {
    return null;
  }

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
            {tickerProducts.map((product) => {
              const direction = getDirection(product);

              const directionStyle =
                direction === "up"
                  ? "font-bold text-red-600"
                  : direction === "down"
                    ? "font-bold text-green-700"
                    : "text-gray-500";

              return (
                <div
                  key={`${copy}-${product.id}`}
                  className="flex shrink-0 items-center gap-2 border-r border-line px-4 py-2.5 text-xs"
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

                  <span className={directionStyle}>
                    {direction === "up"
                      ? "▲"
                      : direction === "down"
                        ? "▼"
                        : "—"}{" "}
                    {bnNumber(getPercentage(product), 1)}%
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

/* =========================================
   NAVBAR
========================================= */

function ProductHeader({ categories, products }) {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white">
      <div className="border-b border-gray-100">
        <div className="bazar-container flex min-h-[66px] items-center justify-between gap-3 py-2">
          <Link
            href="/"
            className="flex min-w-0 items-center gap-2.5"
            aria-label="বাজার দর হোম পেজ"
          >
            <Image
              src="/logo-icon.png"
              alt="বাজার দর লোগো"
              width={42}
              height={42}
              priority
              className="h-10 w-10 shrink-0 object-contain"
            />

            <div className="min-w-0">
              <p className="text-lg font-extrabold leading-tight text-ink">
                বাজার দর
              </p>

              <p className="mt-0.5 text-[10px] text-muted">
                <CurrentDate />
              </p>
            </div>
          </Link>

          <AccountNavigation />
        </div>
      </div>

      <nav
        className="border-b border-gray-100"
        aria-label="পণ্যের ক্যাটাগরি"
      >
        <div className="bazar-container">
          <div className="flex items-center gap-1 overflow-x-auto py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {categories.map((category) => (
              <Link
                key={category.id || category.slug}
                href={`/category/${category.slug}`}
                className="flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-ink transition hover:bg-bazar-green hover:text-white"
              >
                <span>{category.icon || "🛒"}</span>

                <span>{category.nameBn}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>

      <PriceTicker products={products} />
    </header>
  );
}

/* =========================================
   PRICE CHANGE BADGE
========================================= */

function PriceChangeBadge({ product }) {
  const direction = getDirection(product);

  const badgeStyle =
    direction === "up"
      ? "bg-red-50 text-red-600"
      : direction === "down"
        ? "bg-green-50 text-green-700"
        : "bg-gray-100 text-gray-600";

  const symbol =
    direction === "up"
      ? "▲"
      : direction === "down"
        ? "▼"
        : "—";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-bold ${badgeStyle}`}
    >
      {symbol} {bnNumber(getPercentage(product), 1)}%
    </span>
  );
}

/* =========================================
   PRICE SUMMARY CARD
========================================= */

function SummaryCard({ label, value, description, color }) {
  return (
    <div className="rounded-xl border border-line bg-surface p-4 sm:p-5">
      <p className="text-xs font-medium text-muted">
        {label}
      </p>

      <p className={`mt-2 text-xl font-extrabold ${color}`}>
        {bnNumber(value)} টাকা
      </p>

      <p className="mt-1 text-[10px] leading-4 text-ink">
        {description}
      </p>
    </div>
  );
}

/* =========================================
   PRODUCT NOT FOUND
========================================= */

function ProductNotFound() {
  return (
    <section className="rounded-2xl border border-line bg-surface px-5 py-14 text-center">
      <div className="text-5xl" aria-hidden="true">
        🛒
      </div>

      <h1 className="mt-4 text-xl font-extrabold text-ink">
        পণ্যটি পাওয়া যায়নি
      </h1>

      <p className="mt-2 text-sm text-muted">
        দুঃখিত, এই পণ্যের তথ্য পাওয়া যাচ্ছে না।
      </p>

      <Link
        href="/"
        className="mt-6 inline-flex items-center justify-center rounded-lg bg-bazar-green px-5 py-3 text-sm font-bold text-white transition hover:bg-bazar-green-dark"
      >
        হোম পেজে ফিরে যান
      </Link>
    </section>
  );
}

/* =========================================
   API ERROR
========================================= */

function ApiError() {
  return (
    <section className="rounded-2xl border border-line bg-surface px-5 py-14 text-center">
      <div className="text-4xl" aria-hidden="true">
        ⚠️
      </div>

      <h1 className="mt-4 text-xl font-extrabold text-ink">
        পণ্যের তথ্য লোড করা যায়নি
      </h1>

      <p className="mt-2 text-sm text-muted">
        ইন্টারনেট সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।
      </p>

      <Link
        href="/"
        className="mt-6 inline-flex items-center justify-center rounded-lg bg-bazar-green px-5 py-3 text-sm font-bold text-white transition hover:bg-bazar-green-dark"
      >
        হোম পেজে ফিরে যান
      </Link>
    </section>
  );
}

/* =========================================
   MARKET PRICE TABLE
========================================= */

function MarketPriceTable({ markets }) {
  if (markets.length === 0) {
    return (
      <div className="rounded-xl bg-surface-alt px-4 py-8 text-center text-sm text-muted">
        এই পণ্যের বাজারভিত্তিক মূল্য পাওয়া যায়নি।
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-line">
      <table className="w-full min-w-[600px] border-collapse text-left text-xs sm:text-sm">
        <thead className="bg-surface">
          <tr>
            <th className="px-4 py-3 font-bold text-ink">
              বাজার
            </th>

            <th className="px-4 py-3 font-bold text-ink">
              বিভাগ
            </th>

            <th className="px-4 py-3 text-right font-bold text-ink">
              সর্বনিম্ন
            </th>

            <th className="px-4 py-3 text-right font-bold text-ink">
              সর্বাধিক
            </th>

            <th className="px-4 py-3 text-right font-bold text-ink">
              গড়
            </th>
          </tr>
        </thead>

        <tbody>
          {markets.map((market, index) => {
            const minimum = Number(market.min) || 0;
            const maximum = Number(market.max) || 0;
            const average = (minimum + maximum) / 2;

            return (
              <tr
                key={`${market.market}-${index}`}
                className={`border-t border-line ${
                  index % 2 === 0
                    ? "bg-white"
                    : "bg-surface-alt"
                }`}
              >
                <td className="px-4 py-3 text-ink">
                  {market.market}
                </td>

                <td className="px-4 py-3 text-muted">
                  {market.division || "—"}
                </td>

                <td className="px-4 py-3 text-right font-semibold text-green-700">
                  {bnNumber(minimum)} টাকা
                </td>

                <td className="px-4 py-3 text-right font-semibold text-red-600">
                  {bnNumber(maximum)} টাকা
                </td>

                <td className="px-4 py-3 text-right font-semibold text-ink">
                  {bnNumber(average)} টাকা
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* =========================================
   FOOTER
========================================= */

function ProductFooter() {
  return (
    <footer className="mt-auto border-t border-line bg-white">
      <div className="bazar-container flex flex-col justify-between gap-2 py-5 text-center text-[11px] leading-5 text-muted sm:flex-row sm:items-center sm:text-left">
        <p>
          বাজার দর - প্রয়োজনীয় পণ্যের দাম এক নজরে।
        </p>

        <p>
          সকল দাম সময় ও বাজারের অবস্থার ওপর নির্ভর করে পরিবর্তিত হতে পারে।
        </p>
      </div>
    </footer>
  );
}

/* =========================================
   PRODUCT DETAILS PAGE
========================================= */

export default async function ProductDetailsPage({ params }) {
  const { slug } = await params;

  const [products, categories] = await Promise.all([
    getApiData("/products"),
    getApiData("/categories"),
  ]);

  if (!products || !categories) {
    return (
      <div className="flex min-h-screen flex-col bg-page text-ink">
        <main className="bazar-container flex-1 py-8">
          <ApiError />
        </main>

        <ProductFooter />
      </div>
    );
  }

  const product = products.find(
    (item) => item.slug === slug
  );

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col bg-page text-ink">
        <main className="bazar-container flex-1 py-8">
          <ProductNotFound />
        </main>

        <ProductFooter />
      </div>
    );
  }

  const category = categories.find(
    (item) => item.slug === product.category
  );

  const markets = Array.isArray(product.markets)
    ? product.markets
    : [];

  const stats = getMarketStats(markets, product.today);

  const categoryName =
    product.categoryNameBn || category?.nameBn || "";

  return (
    <div className="flex min-h-screen flex-col bg-page text-ink">
      <ProductHeader
        categories={categories}
        products={products}
      />

      <main className="bazar-container flex-1 py-5 sm:py-7">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mb-4 flex flex-wrap items-center gap-2 text-xs text-muted"
        >
          <Link
            href="/"
            className="transition hover:text-bazar-green"
          >
            হোম
          </Link>

          <span aria-hidden="true">›</span>

          <Link
            href={`/category/${product.category}`}
            className="transition hover:text-bazar-green"
          >
            {categoryName}
          </Link>

          <span aria-hidden="true">›</span>

          <span className="font-medium text-ink">
            {product.nameBn}
          </span>
        </nav>

        {/* Product summary */}
        <section className="flex flex-col justify-between gap-5 rounded-2xl border border-line bg-surface p-4 sm:flex-row sm:items-center sm:p-6 lg:p-7">
          <div className="flex min-w-0 items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-surface-alt text-3xl sm:h-16 sm:w-16 sm:text-4xl">
              {product.image || product.categoryIcon || "🛒"}
            </div>

            <div className="min-w-0 flex-1">
              <h1 className="break-words text-xl font-extrabold text-ink sm:text-2xl">
                {product.nameBn}
              </h1>

              <p className="mt-1 text-xs text-muted sm:text-sm">
                {getUnit(product.unit)} · {categoryName}
              </p>

              <p className="mt-2 text-xs leading-6 text-ink sm:text-sm">
                {getPriceChangeText(product)}
              </p>
            </div>
          </div>

          {/* Today's price */}
          <div className="shrink-0 rounded-xl bg-surface-alt p-4 sm:min-w-[145px] sm:text-center">
            <p className="text-xs text-muted">
              আজকের দাম
            </p>

            <p className="mt-1 text-2xl font-extrabold text-ink">
              {bnNumber(product.today)}
            </p>

            <p className="mt-1 text-xs text-muted">
              টাকা / {getShortUnit(product.unit)}
            </p>

            <div className="mt-2 flex justify-center">
              <PriceChangeBadge product={product} />
            </div>
          </div>
        </section>

        {/* Price summary */}
        <section className="mt-5 rounded-2xl border border-line bg-surface p-4 sm:p-6">
          <h2 className="mb-4 text-base font-extrabold text-ink">
            দামের সারসংক্ষেপ
          </h2>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <SummaryCard
              label="সর্বনিম্ন দাম"
              value={stats.minimum}
              description="সবচেয়ে কম দামের বাজার"
              color="text-green-700"
            />

            <SummaryCard
              label="সর্বোচ্চ দাম"
              value={stats.maximum}
              description="সবচেয়ে বেশি দামের বাজার"
              color="text-red-600"
            />

            <SummaryCard
              label="গড় দাম"
              value={stats.average}
              description={`${getUnit(product.unit)}-এর হিসাবে`}
              color="text-green-700"
            />
          </div>
        </section>

        {/* Market-wise prices */}
        <section className="mt-5 rounded-2xl border border-line bg-surface p-4 sm:p-6">
          <h2 className="mb-4 text-base font-extrabold text-ink">
            বাজারভিত্তিক আজকের দাম
          </h2>

          <MarketPriceTable markets={markets} />
        </section>
      </main>

      <ProductFooter />
    </div>
  );
}