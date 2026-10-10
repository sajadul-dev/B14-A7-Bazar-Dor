"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

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

  if (yesterday === 0) return 0;

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
  };

  return units[String(unit || "").toLowerCase()] || `প্রতি ${unit || "ইউনিট"}`;
}

function PriceBadge({ product }) {
  const direction = getDirection(product);

  const badgeStyles = {
    up: "bg-red-50 text-red-600",
    down: "bg-green-50 text-green-700",
    neutral: "bg-gray-100 text-gray-600",
  };

  const symbol = {
    up: "▲",
    down: "▼",
    neutral: "—",
  };

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold ${badgeStyles[direction]}`}
    >
      {symbol[direction]} {bnNumber(getPercentage(product))}%
    </span>
  );
}

function ProductCard({ product }) {
  return (
    <Link
      href={`/product/${product.slug}`}
      className="group flex min-w-0 flex-col justify-between rounded-xl border border-line bg-surface p-3 transition duration-200 hover:-translate-y-0.5 hover:border-green-300 hover:shadow-sm sm:p-3.5"
    >
      <div className="flex min-w-0 items-start gap-2.5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-alt text-xl">
          {product.image || product.categoryIcon || "🛒"}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="break-words text-sm font-bold leading-5 text-ink transition group-hover:text-bazar-green">
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

export default function CategoryProductList({ products = [] }) {
  const [sortOrder, setSortOrder] = useState("default");

  const sortedProducts = useMemo(() => {
    const result = [...products];

    if (sortOrder === "low-high") {
      result.sort(
        (a, b) => Number(a.today || 0) - Number(b.today || 0)
      );
    } else if (sortOrder === "high-low") {
      result.sort(
        (a, b) => Number(b.today || 0) - Number(a.today || 0)
      );
    }

    return result;
  }, [products, sortOrder]);

  return (
    <section>
      {/* Sorting toolbar */}
      <div className="mb-3 flex flex-col justify-between gap-3 rounded-xl border border-line bg-surface px-4 py-3 sm:flex-row sm:items-center">
        <p className="text-xs text-muted">
          মোট{" "}
          <span className="font-bold text-ink">
            {bnNumber(sortedProducts.length, 0)}
          </span>{" "}
          টি পণ্য দেখানো হচ্ছে
        </p>

        <label className="flex items-center gap-2 text-xs text-muted">
          <span>সাজান</span>

          <select
            value={sortOrder}
            onChange={(event) => setSortOrder(event.target.value)}
            className="min-h-9 min-w-[155px] rounded-lg border border-line bg-white px-3 text-xs font-medium text-ink outline-none transition focus:border-bazar-green focus:ring-2 focus:ring-green-100"
          >
            <option value="default">ডিফল্ট</option>

            <option value="low-high">
              দাম: কম থেকে বেশি
            </option>

            <option value="high-low">
              দাম: বেশি থেকে কম
            </option>
          </select>
        </label>
      </div>

      {/* Product grid */}
      {sortedProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {sortedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-line bg-surface px-5 py-12 text-center">
          <div className="text-4xl">🛒</div>

          <h3 className="mt-3 text-base font-bold text-ink">
            কোনো পণ্য পাওয়া যায়নি
          </h3>

          <p className="mt-2 text-sm text-muted">
            এই ক্যাটাগরিতে বর্তমানে কোনো পণ্যের তথ্য নেই।
          </p>

          <Link
            href="/"
            className="mt-5 inline-flex items-center justify-center rounded-lg bg-bazar-green px-5 py-2.5 text-xs font-bold text-white transition hover:bg-bazar-green-dark"
          >
            হোম পেজে ফিরে যান
          </Link>
        </div>
      )}
    </section>
  );
}