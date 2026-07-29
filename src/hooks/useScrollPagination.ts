import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import type {
  UseScrollPaginationOptions,
  UseScrollPaginationResult,
} from "../types";

export function useScrollPagination(
  options: UseScrollPaginationOptions
): UseScrollPaginationResult {
  const {
    onLoadMore,
    enabled = true,
    initialPage = 1,
    immediate = false,
    root = null,
    rootMargin = "0px",
    threshold = 0,
    onLoadingChange,
    onPageChange,
    onSuccess,
    onError,
  } = options;

  const observerRef = useRef<HTMLDivElement>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  const pageRef = useRef(initialPage);
  const loadingRef = useRef(false);
  const hasMoreRef = useRef(true);

  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = useCallback(async () => {
    if (!enabled) return;
    if (loadingRef.current) return;
    if (!hasMoreRef.current) return;

    loadingRef.current = true;

    setLoading(true);
    onLoadingChange?.(true);

    const currentPage = pageRef.current;

    try {
      const more = await onLoadMore(currentPage);

      hasMoreRef.current = more;
      setHasMore(more);

      if (more) {
        pageRef.current += 1;

        setPage(pageRef.current);

        onPageChange?.(pageRef.current);
      }

      setError(null);

      onSuccess?.(currentPage);
    } catch (err) {
      const e =
        err instanceof Error
          ? err
          : new Error(String(err));

      setError(e);

      onError?.(e);
    } finally {
      loadingRef.current = false;

      setLoading(false);

      onLoadingChange?.(false);
    }
  }, [
    enabled,
    onLoadMore,
    onLoadingChange,
    onPageChange,
    onSuccess,
    onError,
  ]);

  const reset = useCallback(() => {
    pageRef.current = initialPage;
    loadingRef.current = false;
    hasMoreRef.current = true;

    setPage(initialPage);
    setLoading(false);
    setError(null);
    setHasMore(true);
  }, [initialPage]);

  useEffect(() => {
    if (!enabled) return;

    if (
      typeof window === "undefined" ||
      !("IntersectionObserver" in window)
    ) {
      return;
    }

    observer.current?.disconnect();

    observer.current = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (!entry?.isIntersecting) return;

        void loadMore();
      },
      {
        root,
        rootMargin,
        threshold,
      }
    );

    const element = observerRef.current;

    if (element) {
      observer.current.observe(element);
    }

    return () => {
      observer.current?.disconnect();
    };
  }, [
    enabled,
    loadMore,
    root,
    rootMargin,
    threshold,
  ]);

  useEffect(() => {
    if (enabled && immediate) {
      void loadMore();
    }
  }, [enabled, immediate, loadMore]);

  return {
    page,
    loading,
    error,
    hasMore,
    observerRef,
    loadMore,
    reset,
  };
}

export default useScrollPagination;