import Image from "next/image";
import Link from "next/link";
import CurrentDate from "./components/CurrentDate";

const API_BASE =
  "https://openapi.programming-hero.com/api/bazardor";

async function getProducts() {
  try {
    const response = await fetch(`${API_BASE}/products`, {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const data = await response.json();

    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Product API error:", error);
    return [];
  }
}

async function getCategories() {
  try {
    const response = await fetch(`${API_BASE}/categories`, {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }

    const data = await response.json();

    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Category API error:", error);
    return [];
  }
}

function bnNumber(value, maximumFractionDigits = 1) {
  return new Intl.NumberFormat("bn-BD", {
    maximumFractionDigits,
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
  if (Number.isFinite(Number(product.change?.pct))) {
    return Math.abs(Number(product.change.pct));
  }

  const today = Number(product.today) || 0;
  const yesterday = Number(product.yesterday) || 0;

  if (!yesterday) return 0;

  return (Math.abs(today - yesterday) / yesterday) * 100;
}

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

  return units[String(unit || "").toLowerCase()] || `প্রতি ${unit || "ইউনিট"}`;
}

function PriceBadge({ product }) {
  const direction = getDirection(product);
  const percentage = getPercentage(product);

  const styles = {
    up: "bg-red-50 text-red-600",
    down: "bg-green-50 text-green-700",
    neutral: "bg-gray-100 text-gray-600",
  };

  const symbols = {
    up: "▲",
    down: "▼",
    neutral: "—",
  };

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold ${styles[direction]}`}
    >
      {symbols[direction]} {bnNumber(percentage)}%
    </span>
  );
}

function ProductCard({ product }) {
  const icon = product.image || product.categoryIcon || "🛒";

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group flex min-w-0 flex-col justify-between rounded-xl border border-line bg-surface p-3 transition duration-200 hover:-translate-y-0.5 hover:border-green-300 hover:shadow-sm sm:p-3.5"
    >
      <div className="flex min-w-0 items-start gap-2.5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-alt text-xl">
          {icon}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="break-words text-sm font-bold leading-5 text-ink group-hover:text-bazar-green">
            {product.nameBn}
          </h3>

          <p className="mt-0.5 text-[11px] text-muted">
            {getUnit(product.unit)}
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-[10px] text-muted">আজকের বাজারদর</p>

          <p className="mt-0.5 text-base font-extrabold text-ink">
            {bnNumber(product.today, 2)} টাকা
          </p>
        </div>

        <PriceBadge product={product} />
      </div>
    </Link>
  );
}

function SectionHeading({ title, subtitle, color = "red", id }) {
  const indicator =
    color === "green" ? "text-green-600" : "text-red-500";

  return (
    <div
      id={id}
      className="mb-3 flex flex-wrap items-end justify-between gap-2"
    >
      <div>
        <h2 className="flex items-center gap-2 text-base font-extrabold text-ink sm:text-lg">
          <span className={indicator}>
            {color === "green" ? "▼" : "▲"}
          </span>

          {title}
        </h2>

        {subtitle && (
          <p className="mt-1 text-xs text-muted">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

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
                  <span>{product.image || product.categoryIcon || "🛒"}</span>

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

function SiteHeader({ categories, products }) {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white">
      {/* Brand row */}
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

          <div className="flex shrink-0 items-center gap-2">
            <Link
              href="/signin"
              className="rounded-lg px-2 py-2 text-xs font-semibold text-ink transition hover:text-bazar-green sm:px-3"
            >
              সাইন ইন
            </Link>

            <Link
              href="/signup"
              className="rounded-lg bg-bazar-green px-3 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-bazar-green-dark sm:px-4"
            >
              সাইন আপ
            </Link>
          </div>
        </div>
      </div>

      {/* Category navigation */}
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

      {/* Price ticker */}
      <PriceTicker products={products} />
    </header>
  );
}

function HeroBanner() {
  return (
    <section className="flex min-h-[190px] flex-col items-center justify-between gap-5 overflow-hidden rounded-2xl border border-line bg-surface px-5 py-5 sm:min-h-[210px] sm:flex-row sm:px-8 sm:py-6 lg:px-10">
      <div className="w-full flex-1">
        <span className="inline-flex rounded-full bg-bazar-green-light px-3 py-1 text-[11px] font-bold text-bazar-green">
          <CurrentDate />
        </span>

        <h1 className="mt-3 max-w-2xl text-2xl font-extrabold leading-tight tracking-tight text-ink sm:text-3xl lg:text-[34px]">
          আজকের বাজারের দাম এক নজরে
        </h1>

        <p className="mt-3 max-w-xl text-xs leading-6 text-muted sm:text-sm">
          চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও প্রয়োজনীয় পণ্যের দাম
          — বাজারদরভিত্তিক তথ্য, যা প্রতিদিনের কেনাকাটায় আপনাকে সাহায্য করবে।
        </p>

        <a
          href="#all-products"
          className="mt-4 inline-flex min-h-10 items-center justify-center rounded-lg bg-bazar-green px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-bazar-green-dark"
        >
          সব পণ্য দেখুন
        </a>
      </div>

      <div className="flex w-full shrink-0 items-center justify-center sm:w-[200px] lg:w-[230px]">
        <Image
          src="/bazar-hero.png"
          alt="বিভিন্ন তাজা পণ্যের ঝুড়ি"
          width={250}
          height={210}
          priority
          className="h-auto w-[170px] object-contain sm:w-[190px] lg:w-[220px]"
        />
      </div>
    </section>
  );
}

function ProductSection({
  title,
  subtitle,
  products,
  color,
  emptyMessage,
  id,
}) {
  return (
    <section>
      <SectionHeading
        title={title}
        subtitle={subtitle}
        color={color}
        id={id}
      />

      {products.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-line bg-surface p-6 text-center text-sm text-muted">
          {emptyMessage}
        </div>
      )}
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line bg-white">
      <div className="bazar-container flex flex-col justify-between gap-2 py-5 text-center text-[11px] leading-5 text-muted sm:flex-row sm:items-center sm:text-left">
        <p>বাজার দর - প্রয়োজনীয় পণ্যের দাম এক নজরে।</p>

        <p>
          সকল দাম সময় ও বাজারের অবস্থার ওপর নির্ভর করে পরিবর্তিত হতে পারে।
        </p>
      </div>
    </footer>
  );
}

export default async function Home() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  const risers = products
    .filter((product) => getDirection(product) === "up")
    .sort(
      (a, b) => getPercentage(b) - getPercentage(a)
    )
    .slice(0, 6);

  const fallers = products
    .filter((product) => getDirection(product) === "down")
    .sort(
      (a, b) => getPercentage(b) - getPercentage(a)
    )
    .slice(0, 6);

  return (
    <div className="flex min-h-screen flex-col bg-page text-ink">
      <SiteHeader categories={categories} products={products} />

      <main className="bazar-container flex-1 py-5 sm:py-7">
        <HeroBanner />

        <div className="mt-7 space-y-7 sm:mt-8 sm:space-y-8">
          <ProductSection
            title="আজ দাম বেড়েছে"
            subtitle="যেসব পণ্যের দাম গত দিনের তুলনায় বেড়েছে"
            products={risers}
            color="red"
            emptyMessage="এই মুহূর্তে দাম বৃদ্ধির কোনো তথ্য পাওয়া যায়নি।"
          />

          <ProductSection
            title="আজ দাম কমেছে"
            subtitle="যেসব পণ্যের দাম গত দিনের তুলনায় কমেছে"
            products={fallers}
            color="green"
            emptyMessage="এই মুহূর্তে দাম কমার কোনো তথ্য পাওয়া যায়নি।"
          />

          <ProductSection
            id="all-products"
            title="সব পণ্য"
            subtitle={`বাজারের প্রয়োজনীয় ${bnNumber(products.length, 0)}টি পণ্যের তালিকা`}
            products={products}
            color="green"
            emptyMessage="পণ্যের তথ্য পাওয়া যায়নি। ইন্টারনেট সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।"
          />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}