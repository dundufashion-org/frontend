export type Product = {
  id: number;
  name: string;
  category: string | null;
  price_cents: number;
  created_at: string;
};

export type BackendStatus =
  | { state: "unconfigured" }
  | { state: "offline"; url: string }
  | { state: "online"; url: string; dbConnected: boolean };

const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "");

export async function getBackendStatus(): Promise<BackendStatus> {
  if (!apiUrl) return { state: "unconfigured" };
  try {
    const res = await fetch(`${apiUrl}/health`, {
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return { state: "offline", url: apiUrl };
    const data: { ok: boolean; db: boolean } = await res.json();
    return { state: "online", url: apiUrl, dbConnected: data.db };
  } catch {
    return { state: "offline", url: apiUrl };
  }
}

export async function getProducts(): Promise<Product[]> {
  if (!apiUrl) return [];
  try {
    const res = await fetch(`${apiUrl}/api/products`, {
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return [];
    const data: { products: Product[] } = await res.json();
    return data.products ?? [];
  } catch {
    return [];
  }
}
