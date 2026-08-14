import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Small async-resource hook: gives every screen a uniform
 * { data, status, error, reload } contract for loading / error / empty states.
 * Swappable for TanStack Query later without touching call sites much.
 */
export function useResource(fetcher, deps = []) {
  const [state, setState] = useState({ data: null, status: "loading", error: null });
  const mounted = useRef(true);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const load = useCallback(async () => {
    setState({ data: null, status: "loading", error: null });
    try {
      const data = await fetcherRef.current();
      if (!mounted.current) return;
      const empty = Array.isArray(data) ? data.length === 0 : data == null;
      setState({ data, status: empty ? "empty" : "success", error: null });
    } catch (error) {
      if (!mounted.current) return;
      setState({ data: null, status: "error", error });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    load();
  }, [load]);

  return { ...state, reload: load };
}
