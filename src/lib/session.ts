const SESSION_KEY = "dermtool-session-id";

/**
 * Generate a UUID v4 string without external dependencies.
 */
export function generateId(): string {
  // Use crypto.randomUUID when available (modern browsers + Node 19+)
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  // Fallback: manual UUID v4 via crypto.getRandomValues
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.getRandomValues === "function"
  ) {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    // Set version (4) and variant (10xx)
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;

    const hex = Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    return [
      hex.slice(0, 8),
      hex.slice(8, 12),
      hex.slice(12, 16),
      hex.slice(16, 20),
      hex.slice(20, 32),
    ].join("-");
  }

  // Last resort: Math.random-based (not cryptographically secure)
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Return a stable anonymous session ID for the current browser session.
 * Creates one on first call and persists it in localStorage.
 */
export function getSessionId(): string {
  if (typeof window === "undefined") {
    // SSR fallback - return a fresh ID each time (will be replaced client-side)
    return generateId();
  }

  try {
    const existing = localStorage.getItem(SESSION_KEY);
    if (existing) return existing;

    const id = generateId();
    localStorage.setItem(SESSION_KEY, id);
    return id;
  } catch {
    // localStorage unavailable
    return generateId();
  }
}
