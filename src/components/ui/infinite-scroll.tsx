"use client";

import { useEffect, useRef } from "react";
import { useInView } from "framer-motion";
import { cn } from "@/lib/utils";

interface InfiniteScrollProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  loadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
  className?: string;
  loader?: React.ReactNode;
}

export function InfiniteScroll<T>({
  items,
  renderItem,
  loadMore,
  hasMore,
  isLoading,
  className,
  loader,
}: InfiniteScrollProps<T>) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref);

  useEffect(() => {
    if (isInView && hasMore && !isLoading) {
      loadMore();
    }
  }, [isInView, hasMore, isLoading, loadMore]);

  return (
    <div className={className}>
      {items.map((item, index) => (
        <div key={index}>{renderItem(item)}</div>
      ))}
      {hasMore && (
        <div ref={ref} className="flex justify-center py-4">
          {loader || (
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          )}
        </div>
      )}
    </div>
  );
}
