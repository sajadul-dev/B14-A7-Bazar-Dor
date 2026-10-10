import Image from "next/image";
import Link from "next/link";
import AccountNavigation from "../../components/AccountNavigation";

import CurrentDate from "../../components/CurrentDate";
import CategoryProductList from "../../components/CategoryProductList";

const API_BASE =
  "https://openapi.programming-hero.com/api/bazardor";

// Fetch API data safely.
async function getApiData(endpoint) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      throw new Error(
        `API request failed: ${response.status}`
      );
    }

    const data = await response.json();

    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error(`BazarDor API error (${endpoint}):`, error);

    return [];
  }
}

// Bengali number formatting.
function bnNumber(value, maximumFractionDigits = 0) {
  return new Intl.NumberFormat("bn-BD", {
    maximumFractionDigits,
  }).format(Number(value) || 0);
}

// Check whether a product's price increased, decreased, or remained unchanged.
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
  const apiPercentage = product.change?.pct;

  if (
    apiPercentage !== undefined &&
    apiPercentage !== null &&
    Number.isFinite(Number(apiPercentage))
  ) {
    return Math.abs(Number(apiPercentage));
  }

  const today = Number(product.today) || 0;
  const yesterday = Number(product.yesterday) || 0;

  if (yesterday === 0) return 0;

  return (
    (Math.abs(today - yesterday) / yesterday) *
    100
  );
}

// Infinite scrolling price ticker.
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
                    {bnNumber(product.today, 2)} টাকা
                  </span>

                  <span
                    className={
                      direction === "up"
                        ? "font-bold text-red-600"
                        : direction === "down"
                          ? "font-bold text-green-700"
                          : "text-gray-500"
                    }
                  >
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

// Header shared visually with the Home page.
function CategoryHeader({ categories, products, activeSlug }) {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white">
      {/* Brand and authentication links */}
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

      {/* Category navigation */}
      <nav
        className="border-b border-gray-100"
        aria-label="পণ্যের ক্যাটাগরি"
      >
        <div className="bazar-container">
          <div className="flex items-center gap-1 overflow-x-auto py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {categories.map((category) => {
              const isActive = category.slug === activeSlug;

              return (
                <Link
                  key={category.id || category.slug}
                  href={`/category/${category.slug}`}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                    isActive
                      ? "bg-bazar-green text-white"
                      : "text-ink hover:bg-bazar-green hover:text-white"
                  }`}
                >
                  <span>
                    {category.icon || "🛒"}
                  </span>

                  <span>{category.nameBn}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Price ticker */}
      <PriceTicker products={products} />
    </header>
  );
}

function CategoryFooter() {
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

function InvalidCategory() {
  return (
    <section className="rounded-2xl border border-line bg-surface px-5 py-14 text-center sm:px-10">
      <div className="text-5xl" aria-hidden="true">
        🛒
      </div>

      <h1 className="mt-4 text-xl font-extrabold text-ink">
        ক্যাটাগরি পাওয়া যায়নি
      </h1>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">
        দুঃখিত, এই ক্যাটাগরিটি পাওয়া যায়নি অথবা ঠিকানা ভুল হয়েছে।
        অন্য পণ্য দেখতে হোম পেজে ফিরে যান।
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

export default async function CategoryPage({ params }) {
  const { slug } = await params;

  const [categories, categoryProducts, allProducts] =
    await Promise.all([
      getApiData("/categories"),

      getApiData(
        `/products?category=${encodeURIComponent(slug)}`
      ),

      getApiData("/products"),
    ]);

  const category = categories.find(
    (item) => item.slug === slug
  );

  // Check the category against the API data.
  const validCategory = Boolean(category);

  // Use the category endpoint first. If it returns no items,
  // use the verified full product list as a fallback.
  const fallbackProducts = allProducts.filter(
    (product) =>
      product.category === slug ||
      product.category?.slug === slug
  );

  const products =
    categoryProducts.length > 0
      ? categoryProducts
      : fallbackProducts;

  return (
    <div className="flex min-h-screen flex-col bg-page text-ink">
      <CategoryHeader
        categories={categories}
        products={allProducts}
        activeSlug={slug}
      />

      <main className="bazar-container flex-1 py-5 sm:py-7">
        {validCategory ? (
          <>
            {/* Category title */}
            <section className="flex items-center gap-4 rounded-2xl border border-line bg-surface px-4 py-5 sm:px-6 sm:py-6">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-surface-alt text-3xl sm:h-16 sm:w-16 sm:text-4xl">
                {category.icon || "🛒"}
              </div>

              <div className="min-w-0">
                <h1 className="text-xl font-extrabold text-ink sm:text-2xl">
                  {category.nameBn}
                </h1>

                <p className="mt-1 text-xs leading-5 text-muted sm:text-sm">
                  {bnNumber(products.length)}টি পণ্যের
                  আজকের বাজারদর ও পরিবর্তন
                </p>
              </div>
            </section>

            {/* Sorting control and product cards */}
            <div className="mt-4">
              <CategoryProductList products={products} />
            </div>
          </>
        ) : (
          <InvalidCategory />
        )}
      </main>

      <CategoryFooter />
    </div>
  );
}