import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { ROLES, SCENARIOS } from "@/lib/mock-data";
import { byteforgeService } from "@/services/byteforge-service";

const AppContext = createContext(null);

const STORAGE_KEY = "byteforge.session";

function readStored() {
  if (typeof window === "undefined") return null;
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "null");
  } catch {
    return null;
  }
}

export function AppProvider({ children }) {
  const [role, setRole] = useState("staff");
  const [scenarioId, setScenarioId] = useState("hospital");
  const [theme, setTheme] = useState("light");
  const [hydrated, setHydrated] = useState(false);
  const [scenarios, setScenarios] = useState(SCENARIOS);

  useEffect(() => {
    const stored = readStored();
    if (stored?.role) setRole(stored.role);
    
    byteforgeService.getScenarios().then((data) => {
      if (data && data.length > 0) {
        setScenarios(data);
        if (stored?.scenarioId && data.find(s => s.id === stored.scenarioId)) {
          setScenarioId(stored.scenarioId);
        } else {
          setScenarioId(data[0].id);
        }
      }
    }).catch(err => {
      console.error(err);
      if (stored?.scenarioId) setScenarioId(stored.scenarioId);
    }).finally(() => {
      const preferred =
        stored?.theme ??
        (window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      setTheme(preferred);
      setHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    document.documentElement.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ role, scenarioId, theme }));
  }, [role, scenarioId, theme, hydrated]);

  const value = useMemo(
    () => ({
      role,
      setRole,
      roles: ROLES,
      scenarioId,
      setScenarioId,
      scenarios,
      scenario: scenarios.find((s) => s.id === scenarioId) ?? scenarios[0],
      theme,
      toggleTheme: () => setTheme((t) => (t === "dark" ? "light" : "dark")),
      hydrated,
    }),
    [role, scenarioId, theme, hydrated, scenarios],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
}
