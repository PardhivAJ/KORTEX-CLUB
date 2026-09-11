import { useEffect, useState } from "react";

export function useFetch<T>(loader: () => Promise<T>, deps: unknown[] = []) {
  const [data, setData] = useState<T | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    loader().then((value) => {
      if (active) { setData(value); setError(null); }
    }).catch((e: unknown) => {
      if (active) setError(e instanceof Error ? e.message : "Something went wrong.");
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  const refetch = () => { setLoading(true); return loader().then((value) => { setData(value); setError(null); return value; }).catch((e) => { setError(e instanceof Error ? e.message : "Something went wrong."); throw e; }).finally(() => setLoading(false)); };
  return { data, loading, error, refetch };
}