/**
 * Transport layer.
 *
 * Today every call resolves from in-memory fixtures after a small latency so
 * loading/error states are real. To connect a backend later, flip USE_MOCK to
 * false (or set VITE_API_URL) and implement `request` with fetch — no component
 * or service signature changes required.
 */

const API_URL = import.meta.env?.VITE_API_URL || "http://localhost:8080/api";
export const USE_MOCK = false;

const LATENCY_MS = 420;
const FAILURE_RATE = 0; // raise locally to exercise error states

export class ApiError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export function mockResponse(resolver, { latency = LATENCY_MS } = {}) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < FAILURE_RATE) {
        reject(new ApiError("The service is temporarily unavailable.", 503));
        return;
      }
      try {
        resolve(structuredClone(resolver()));
      } catch (error) {
        reject(new ApiError(error.message, 500));
      }
    }, latency);
  });
}

export async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers ?? {}) },
    ...options,
  });
  if (!response.ok) throw new ApiError(`Request failed: ${path}`, response.status);
  return response.json();
}
