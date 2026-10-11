import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-page px-4 py-10 text-ink">
      <section className="w-full max-w-lg rounded-2xl border border-line bg-surface px-6 py-12 text-center shadow-sm sm:px-10">
        {/* 404 Illustration */}
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-2xl bg-surface-alt text-5xl">
          🛒
        </div>

        <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-bazar-green">
          Error 404
        </p>

        <h1 className="mt-3 text-2xl font-extrabold text-ink sm:text-3xl">
          পেজটি খুঁজে পাওয়া যায়নি!
        </h1>

        <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-muted">
          দুঃখিত, আপনি যে পেজটি খুঁজছেন সেটি পাওয়া যায়নি।
          পেজের ঠিকানা পরীক্ষা করুন অথবা হোম পেজে ফিরে যান।
        </p>

        <Link
          href="/"
          className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-bazar-green px-6 py-3 text-sm font-bold text-white transition hover:bg-bazar-green-dark focus:outline-none focus:ring-2 focus:ring-bazar-green focus:ring-offset-2"
        >
          <span aria-hidden="true">←</span>
          হোম পেজে ফিরে যান
        </Link>

        <p className="mt-8 border-t border-line pt-4 text-xs text-muted">
          বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে।
        </p>
      </section>
    </main>
  );
}