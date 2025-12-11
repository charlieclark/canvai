"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import type { AssetToAdd } from "../page";

interface CollectionItem {
  title: string;
  file_name: string;
  slug: string;
  category: string;
  tags: string[];
  volume: number;
}

interface CollectionData {
  object_count: number;
  size: number;
  items: CollectionItem[];
}

interface CollectionBrowserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddAssetToCanvas: (asset: AssetToAdd) => void;
}

// Number of items to display at once for performance
const ITEMS_PER_PAGE = 100;

// Default size for collection icons
const ICON_SIZE = 256;

export function CollectionBrowserModal({
  open,
  onOpenChange,
  onAddAssetToCanvas,
}: CollectionBrowserModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [collectionData, setCollectionData] = useState<CollectionData | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);

  const debouncedSearch = useDebounce(searchQuery, 300);

  // Load data when modal opens
  useEffect(() => {
    if (open && !collectionData && !isLoading) {
      setIsLoading(true);
      import("../_data/thiings-meta.json")
        .then((data) => {
          setCollectionData(data as unknown as CollectionData);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Failed to load collection data:", error);
          setIsLoading(false);
        });
    }
  }, [open, collectionData, isLoading]);

  // Reset display count when search changes
  useEffect(() => {
    setDisplayCount(ITEMS_PER_PAGE);
  }, [debouncedSearch]);

  // Filter items based on search query
  const filteredItems = useMemo(() => {
    if (!collectionData) return [];

    const query = debouncedSearch.toLowerCase().trim();
    if (!query) {
      return collectionData.items;
    }

    return collectionData.items.filter((item) => {
      return (
        item.title.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    });
  }, [collectionData, debouncedSearch]);

  // Get visible items (limited for performance)
  const visibleItems = useMemo(() => {
    return filteredItems.slice(0, displayCount);
  }, [filteredItems, displayCount]);

  const hasMore = displayCount < filteredItems.length;

  // Handle scroll to load more
  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const target = e.target as HTMLDivElement;
      const bottom =
        target.scrollHeight - target.scrollTop - target.clientHeight < 200;
      if (bottom && hasMore) {
        setDisplayCount((prev) => prev + ITEMS_PER_PAGE);
      }
    },
    [hasMore],
  );

  const handleAddToCanvas = useCallback(
    (item: CollectionItem) => {
      onAddAssetToCanvas({
        id: `collection-${item.slug}`,
        name: item.title,
        src: `/thiings/${item.file_name}`,
        width: ICON_SIZE,
        height: ICON_SIZE,
        mimeType: "image/png",
      });
      onOpenChange(false);
    },
    [onAddAssetToCanvas, onOpenChange],
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[80vh] flex-col sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Add From Collection</DialogTitle>
          <DialogDescription>
            Browse and search through 9,000+ icons to add to your canvas.
          </DialogDescription>
        </DialogHeader>

        {/* Search input */}
        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Search icons by name, category, or tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Results count */}
        {collectionData && !isLoading && (
          <p className="text-muted-foreground text-sm">
            {debouncedSearch
              ? `${filteredItems.length} results for "${debouncedSearch}"`
              : `${collectionData.object_count.toLocaleString()} icons available`}
          </p>
        )}

        {/* Loading state */}
        {isLoading && (
          <div className="flex flex-1 items-center justify-center py-12">
            <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
          </div>
        )}

        {/* Icons grid */}
        {!isLoading && collectionData && (
          <div
            className="min-h-0 flex-1 overflow-y-auto"
            onScroll={handleScroll}
          >
            <div className="grid grid-cols-6 gap-2 p-1 sm:grid-cols-8">
              {visibleItems.map((item) => (
                <button
                  key={item.slug}
                  onClick={() => handleAddToCanvas(item)}
                  className="hover:bg-muted group flex aspect-square flex-col items-center justify-center rounded-lg border p-2 transition-colors"
                  title={item.title}
                >
                  <img
                    src={`/thiings/${item.file_name}`}
                    alt={item.title}
                    className="h-12 w-12 object-contain"
                    loading="lazy"
                  />
                  <span className="mt-1 w-full truncate text-center text-[10px] leading-tight">
                    {item.title}
                  </span>
                </button>
              ))}
            </div>

            {/* Load more indicator */}
            {hasMore && (
              <div className="text-muted-foreground flex items-center justify-center py-4 text-sm">
                Scroll for more ({filteredItems.length - displayCount} remaining)
              </div>
            )}

            {/* No results */}
            {filteredItems.length === 0 && debouncedSearch && (
              <div className="text-muted-foreground py-12 text-center">
                <p>No icons found for &ldquo;{debouncedSearch}&rdquo;</p>
                <p className="mt-1 text-sm">Try a different search term</p>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
