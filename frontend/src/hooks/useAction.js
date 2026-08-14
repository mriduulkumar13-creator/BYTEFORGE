import { useCallback, useRef, useState } from "react";

/**
 * Async-action (mutation) counterpart to useResource.
 * Gives every write a uniform { run, reset, data, status, error } contract with
 * idle / loading / success / error states.
 */
export function useAction(action) {
  const [state, setState] = useState({ data: null, status: "idle", error: null });
  const actionRef = useRef(action);
  actionRef.current = action;

  const run = useCallback(async (...args) => {
    setState({ data: null, status: "loading", error: null });
    try {
      const data = await actionRef.current(...args);
      setState({ data, status: "success", error: null });
      return data;
    } catch (error) {
      setState({ data: null, status: "error", error });
      return null;
    }
  }, []);

  const reset = useCallback(() => setState({ data: null, status: "idle", error: null }), []);

  return { ...state, run, reset };
}
