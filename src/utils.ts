/**
 * Returns true when running in a browser.
 * Prevents SSR errors in Next.js.
 */
export function isBrowser(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof document !== "undefined"
  );
}

/**
 * No-operation function.
 */
export function noop(): void {}

/**
 * Safely disconnect an IntersectionObserver.
 */
export function disconnectObserver(
  observer: IntersectionObserver | null
): void {
  observer?.disconnect();
}

/**
 * Observe an element if both observer and element exist.
 */
export function observeElement(
  observer: IntersectionObserver | null,
  element: Element | null
): void {
  if (!observer || !element) return;

  observer.observe(element);
}

/**
 * Unobserve an element safely.
 */
export function unobserveElement(
  observer: IntersectionObserver | null,
  element: Element | null
): void {
  if (!observer || !element) return;

  observer.unobserve(element);
}

/**
 * Create a configured IntersectionObserver.
 */
export function createObserver(
  callback: IntersectionObserverCallback,
  options?: IntersectionObserverInit
): IntersectionObserver | null {
  if (!isBrowser()) {
    return null;
  }

  if (!("IntersectionObserver" in window)) {
    return null;
  }

  return new IntersectionObserver(callback, options);
}

/**
 * Execute an async function and always return
 * an Error instance on failure.
 */
export async function safeAsync<T>(
  fn: () => Promise<T>
): Promise<{
  data?: T;
  error?: Error;
}> {
  try {
    const data = await fn();

    return {
      data,
    };
  } catch (err) {
    return {
      error:
        err instanceof Error
          ? err
          : new Error(String(err)),
    };
  }
}

/**
 * Clamp a number between min and max.
 */
export function clamp(
  value: number,
  min: number,
  max: number
): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Delay execution.
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/**
 * Returns true if the value is a function.
 */
export function isFunction<T extends (...args: any[]) => any>(
  value: unknown
): value is T {
  return typeof value === "function";
}

/**
 * Generate a unique observer ID.
 */
export function generateId(prefix = "scroll"): string {
  return `${prefix}-${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}