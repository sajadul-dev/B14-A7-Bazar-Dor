export default function Loading() {
  return (
    <div className="min-h-screen animate-pulse bg-page">
      {/* Navbar Skeleton */}
      <header className="border-b border-line bg-white">
        <div className="bazar-container">
          <div className="flex min-h-[66px] items-center justify-between gap-4 py-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gray-200" />

              <div className="space-y-2">
                <div className="h-4 w-24 rounded bg-gray-200" />
                <div className="h-3 w-20 rounded bg-gray-200" />
              </div>
            </div>

            <div className="flex gap-2">
              <div className="h-9 w-16 rounded-lg bg-gray-200" />
              <div className="h-9 w-20 rounded-lg bg-gray-200" />
            </div>
          </div>

          {/* Category Navigation Skeleton */}
          <div className="flex gap-3 overflow-hidden py-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-8 w-20 shrink-0 rounded-full bg-gray-200"
              />
            ))}
          </div>
        </div>

        {/* Price Ticker Skeleton */}
        <div className="flex gap-6 overflow-hidden border-t border-line px-4 py-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="h-4 w-36 shrink-0 rounded bg-gray-200"
            />
          ))}
        </div>
      </header>

      <main className="bazar-container py-6 sm:py-8">
        {/* Hero Skeleton */}
        <section className="grid gap-6 rounded-2xl border border-line bg-white p-5 sm:grid-cols-2 sm:items-center sm:p-8">
          <div className="space-y-4">
            <div className="h-4 w-32 rounded bg-gray-200" />
            <div className="h-8 w-full max-w-sm rounded bg-gray-200" />
            <div className="h-4 w-full max-w-md rounded bg-gray-200" />
            <div className="h-4 w-4/5 rounded bg-gray-200" />
            <div className="h-11 w-36 rounded-xl bg-gray-200" />
          </div>

          <div className="min-h-48 rounded-2xl bg-gray-200 sm:min-h-64" />
        </section>

        {/* Rising and Falling Product Sections */}
        {[0, 1].map((section) => (
          <section key={section} className="mt-8">
            <div className="mb-4 h-6 w-52 rounded bg-gray-200" />

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-line bg-white p-4"
                >
                  <div className="mb-4 h-12 w-12 rounded-xl bg-gray-200" />
                  <div className="mb-2 h-4 w-4/5 rounded bg-gray-200" />
                  <div className="mb-3 h-3 w-2/3 rounded bg-gray-200" />
                  <div className="h-5 w-3/4 rounded bg-gray-200" />
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* All Products Skeleton */}
        <section className="mt-8" id="সব-পণ্য">
          <div className="mb-2 h-6 w-32 rounded bg-gray-200" />
          <div className="mb-5 h-4 w-64 max-w-full rounded bg-gray-200" />

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="rounded-xl border border-line bg-white p-4"
              >
                <div className="mb-4 flex h-20 items-center justify-center rounded-lg bg-gray-100 sm:h-28">
                  <div className="h-12 w-12 rounded-xl bg-gray-200" />
                </div>

                <div className="mb-2 h-4 w-4/5 rounded bg-gray-200" />
                <div className="mb-3 h-3 w-2/3 rounded bg-gray-200" />

                <div className="flex items-center justify-between gap-2">
                  <div className="h-5 w-20 rounded bg-gray-200" />
                  <div className="h-6 w-12 rounded-full bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}