import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";

import { useScrollPagination } from "../src/hooks/useScrollPagination";

class MockIntersectionObserver {
  observe = vi.fn();

  unobserve = vi.fn();

  disconnect = vi.fn();

  constructor(
    public callback: IntersectionObserverCallback
  ) {}
}

beforeEach(() => {
  vi.stubGlobal(
    "IntersectionObserver",
    MockIntersectionObserver
  );
});

describe("useScrollPagination", () => {

  it("should initialize correctly", () => {

    const { result } = renderHook(() =>
      useScrollPagination({

        onLoadMore: vi.fn(async () => true)

      })
    );

    expect(result.current.page).toBe(1);

    expect(result.current.loading).toBe(false);

    expect(result.current.error).toBeNull();

    expect(result.current.hasMore).toBe(true);

    expect(result.current.observerRef.current).toBeNull();

  });

  it("should load next page", async () => {

    const onLoadMore = vi.fn(async () => true);

    const { result } = renderHook(() =>
      useScrollPagination({

        onLoadMore

      })
    );

    await act(async () => {

      await result.current.loadMore();

    });

    expect(onLoadMore).toHaveBeenCalledTimes(1);

    expect(result.current.page).toBe(2);

  });

  it("should stop when callback returns false", async () => {

    const onLoadMore = vi.fn(async () => false);

    const { result } = renderHook(() =>
      useScrollPagination({

        onLoadMore

      })
    );

    await act(async () => {

      await result.current.loadMore();

    });

    expect(result.current.hasMore).toBe(false);

  });

  it("should capture thrown errors", async () => {

    const onLoadMore = vi.fn(async () => {

      throw new Error("Network Error");

    });

    const { result } = renderHook(() =>
      useScrollPagination({

        onLoadMore

      })
    );

    await act(async () => {

      await result.current.loadMore();

    });

    expect(result.current.error).not.toBeNull();

    expect(result.current.error?.message).toBe(
      "Network Error"
    );

  });

  it("should reset pagination", async () => {

    const onLoadMore = vi.fn(async () => true);

    const { result } = renderHook(() =>
      useScrollPagination({

        onLoadMore

      })
    );

    await act(async () => {

      await result.current.loadMore();

    });

    expect(result.current.page).toBe(2);

    act(() => {

      result.current.reset();

    });

    expect(result.current.page).toBe(1);

    expect(result.current.hasMore).toBe(true);

    expect(result.current.error).toBeNull();

  });

  it("should ignore loadMore while already loading", async () => {

    let resolvePromise!: () => void;

    const onLoadMore = vi.fn(
      () =>
        new Promise<boolean>((resolve) => {

          resolvePromise = () => resolve(true);

        })
    );

    const { result } = renderHook(() =>
      useScrollPagination({

        onLoadMore

      })
    );

    act(() => {

      result.current.loadMore();

      result.current.loadMore();

    });

    expect(onLoadMore).toHaveBeenCalledTimes(1);

    await act(async () => {

      resolvePromise();

    });

  });

  it("should not load when hasMore is false", async () => {

    const onLoadMore = vi.fn(async () => false);

    const { result } = renderHook(() =>
      useScrollPagination({

        onLoadMore

      })
    );

    await act(async () => {

      await result.current.loadMore();

    });

    expect(result.current.hasMore).toBe(false);

    await act(async () => {

      await result.current.loadMore();

    });

    expect(onLoadMore).toHaveBeenCalledTimes(1);

  });

  it("should call onLoadMore with correct page numbers", async () => {

    const onLoadMore = vi.fn(async () => true);

    const { result } = renderHook(() =>
      useScrollPagination({

        onLoadMore

      })
    );

    await act(async () => {

      await result.current.loadMore();

      await result.current.loadMore();

      await result.current.loadMore();

    });

    expect(onLoadMore).toHaveBeenNthCalledWith(1, 1);

    expect(onLoadMore).toHaveBeenNthCalledWith(2, 2);

    expect(onLoadMore).toHaveBeenNthCalledWith(3, 3);

  });

  it("should expose observerRef", () => {

    const { result } = renderHook(() =>
      useScrollPagination({

        onLoadMore: vi.fn(async () => true)

      })
    );

    expect(result.current.observerRef).toBeDefined();

  });

});