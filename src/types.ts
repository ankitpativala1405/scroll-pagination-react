import { RefObject } from "react";

/**
 * Configuration options for useScrollPagination
 */
export interface UseScrollPaginationOptions {
  /**
   * Callback invoked when a new page should be loaded.
   *
   * Return:
   *  - true  => more pages are available
   *  - false => no more pages
   */
  onLoadMore: (page: number) => Promise<boolean>;

  /**
   * Enable/disable pagination.
   *
   * @default true
   */
  enabled?: boolean;

  /**
   * Root element for IntersectionObserver.
   *
   * @default null
   */
  root?: Element | Document | null;

  /**
   * Margin around the root.
   *
   * @default "0px"
   */
  rootMargin?: string;

  /**
   * Intersection threshold.
   *
   * @default 0
   */
  threshold?: number | number[];

  /**
   * Initial page number.
   *
   * @default 1
   */
  initialPage?: number;

  /**
   * Automatically load the first page.
   *
   * @default true
   */
  immediate?: boolean;

  /**
   * Stop pagination after the last page.
   *
   * @default true
   */
  stopOnEnd?: boolean;

  /**
   * Called before loading starts.
   */
  onLoadingChange?: (loading: boolean) => void;

  /**
   * Called whenever the page changes.
   */
  onPageChange?: (page: number) => void;

  /**
   * Called when an error occurs.
   */
  onError?: (error: Error) => void;

  /**
   * Called after a successful page load.
   */
  onSuccess?: (page: number) => void;
}

/**
 * Values returned by useScrollPagination
 */
export interface UseScrollPaginationResult {
  /**
   * Current page.
   */
  page: number;

  /**
   * Whether a request is currently running.
   */
  loading: boolean;

  /**
   * Last error.
   */
  error: Error | null;

  /**
   * Whether additional pages exist.
   */
  hasMore: boolean;

  /**
   * Element observed by IntersectionObserver.
   */
  observerRef: RefObject<HTMLDivElement | null>;

  /**
   * Reset pagination.
   */
  reset: () => void;

  /**
   * Manually trigger loading.
   */
  loadMore: () => Promise<void>;
}