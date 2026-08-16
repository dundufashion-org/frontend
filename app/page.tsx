import { getBackendStatus, getProducts } from "@/lib/api";

export const dynamic = "force-dynamic";

function StatusDot({ ok }: { ok: boolean }) {
  return (
    <span
      className={`inline-block h-2.5 w-2.5 shrink-0 rounded-full ${
        ok ? "bg-emerald-500" : "bg-amber-500"
      }`}
    />
  );
}

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export default async function Home() {
  const status = await getBackendStatus();
  const products =
    status.state === "online" && status.dbConnected ? await getProducts() : [];

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-3xl flex-1 flex-col gap-10 px-6 py-24 sm:px-16">
        <header className="flex flex-col gap-2">
          <h1 className="text-4xl font-semibold tracking-tight text-black dark:text-zinc-50">
            Dundu
          </h1>
          <p className="text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Fashion, front to back — Next.js on Vercel, Express + Postgres on
            Railway.
          </p>
        </header>

        <section className="rounded-2xl border border-black/[.08] bg-white p-6 dark:border-white/[.145] dark:bg-zinc-950">
          <h2 className="mb-4 text-sm font-medium tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
            Backend status
          </h2>
          {status.state === "unconfigured" ? (
            <p className="leading-7 text-zinc-700 dark:text-zinc-300">
              Not configured — set{" "}
              <code className="rounded bg-black/[.06] px-1.5 py-0.5 font-mono text-[0.9em] dark:bg-white/[.08]">
                NEXT_PUBLIC_API_URL
              </code>{" "}
              to your Railway backend URL in the Vercel project settings, then
              redeploy.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <StatusDot ok={status.state === "online"} />
                <span className="text-zinc-800 dark:text-zinc-200">
                  API {status.state === "online" ? "online" : "unreachable"}
                </span>
                <code className="ml-auto truncate font-mono text-xs text-zinc-500 dark:text-zinc-400">
                  {status.url}
                </code>
              </div>
              {status.state === "online" && (
                <div className="flex items-center gap-3">
                  <StatusDot ok={status.dbConnected} />
                  <span className="text-zinc-800 dark:text-zinc-200">
                    Database {status.dbConnected ? "connected" : "not connected"}
                  </span>
                </div>
              )}
            </div>
          )}
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-sm font-medium tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
            Products
          </h2>
          {products.length === 0 ? (
            <p className="leading-7 text-zinc-500 dark:text-zinc-400">
              No products to show yet — they load from the backend once it is
              connected to Postgres.
            </p>
          ) : (
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {products.map((product) => (
                <li
                  key={product.id}
                  className="rounded-2xl border border-black/[.08] bg-white p-5 dark:border-white/[.145] dark:bg-zinc-950"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-medium text-black dark:text-zinc-50">
                      {product.name}
                    </span>
                    <span className="text-zinc-700 dark:text-zinc-300">
                      {formatPrice(product.price_cents)}
                    </span>
                  </div>
                  {product.category && (
                    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                      {product.category}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
