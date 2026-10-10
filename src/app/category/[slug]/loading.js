export default function CategoryLoading() {
  return (
    <div className="min-h-screen bg-page">
      {/* Header skeleton */}
      <header className="border-b border-line bg-white">
        <div className="bazar-container flex min-h-[66px] items-center justify-between gap-4 py-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 animate-pulse rounded-xl bg-gray-200" />

            <div className="space-y-2">
              <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />

              <div className="h-3 w-32 animate-pulse rounded bg-gray-100" />
            </div>
          </div>

          <div className="flex gap-2">
            <div className="h-9 w-16 animate-pulse rounded-lg bg-gray-100" />

            <div className="h-9 w-20 animate-pulse rounded-lg bg-gray-200" />
          </div>
        </div>

        <div className="bazar-container flex gap-3 overflow-hidden py-3">
          {Array.from({ length: 7 }).map((_, index) => (
            <div
              key={index}
              className="h-7 w-16 shrink-0 animate-pulse rounded-full bg-gray-100"
            />
          ))}
        </div>

        <div className="h-9 animate-pulse border-y border-line bg-gray-50" />
      </header>

      {/* Main content skeleton */}
      <main className="bazar-container py-6">
        <div className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-5">
          <div className="h-14 w-14 animate-pulse rounded-xl bg-gray-200" />

          <div className="flex-1 space-y-3">
            <div className="h-5 w-32 animate-pulse rounded bg-gray-200" />

            <div className="h-3 w-48 max-w-full animate-pulse rounded bg-gray-100" />
          </div>
        </div>

        <div className="mt-4 h-14 animate-pulse rounded-xl border border-line bg-surface" />

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="rounded-xl border border-line bg-surface p-4"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 animate-pulse rounded-xl bg-gray-200" />

                <div className="flex-1 space-y-2">
                  <div className="h-4 w-28 animate-pulse rounded bg-gray-200" />

                  <div className="h-3 w-20 animate-pulse rounded bg-gray-100" />
                </div>
              </div>

              <div className="mt-5 h-3 w-20 animate-pulse rounded bg-gray-100" />

              <div className="mt-2 h-5 w-24 animate-pulse rounded bg-gray-200" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}