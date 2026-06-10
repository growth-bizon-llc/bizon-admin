"use client";

import { useState, useRef, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useProducts } from "@/lib/api/hooks/use-products";
import { formatMoney } from "@/lib/utils/format-money";
import LoadingSpinner from "@/components/ui/loading-spinner";

interface ProductPickerProps {
  selectedSlugs: string[];
  onChange: (slugs: string[]) => void;
  maxItems?: number;
  label?: string;
}

export default function ProductPicker({
  selectedSlugs,
  onChange,
  maxItems = 8,
  label,
}: ProductPickerProps) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const atLimit = selectedSlugs.length >= maxItems;

  // Debounce the search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { data, isLoading } = useProducts({
    search: debouncedQuery || undefined,
  });

  const products = data?.products ?? [];
  const filteredProducts = products.filter((p) => !selectedSlugs.includes(p.slug));

  const handleSelect = (slug: string) => {
    if (!atLimit) {
      onChange([...selectedSlugs, slug]);
    }
    setQuery("");
    setOpen(false);
  };

  const handleRemove = (slug: string) => {
    onChange(selectedSlugs.filter((s) => s !== slug));
  };

  // Build a name map from current results to display selected product names
  const nameMap = new Map(products.map((p) => [p.slug, p]));

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      )}

      {/* Search input */}
      <div ref={wrapperRef} className="relative">
        {atLimit ? (
          <p className="text-sm text-amber-600 py-2">
            Maximum of {maxItems} products reached. Remove one to add another.
          </p>
        ) : (
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder="Search products to add..."
            className="block w-full rounded-md border border-gray-300 bg-white text-gray-900 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        )}

        {/* Dropdown */}
        {open && !atLimit && (
          <div className="absolute z-10 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg max-h-60 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-4">
                <LoadingSpinner className="h-5 w-5 text-indigo-600" />
              </div>
            ) : filteredProducts.length === 0 ? (
              <p className="px-3 py-3 text-sm text-gray-500">
                {debouncedQuery ? "No products found." : "Type to search products."}
              </p>
            ) : (
              filteredProducts.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => handleSelect(product.slug)}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-indigo-50 transition-colors text-left"
                >
                  <span className="font-medium text-gray-900 truncate">{product.name}</span>
                  <span className="text-gray-500 ml-2 shrink-0">
                    {formatMoney(product.base_price)}
                  </span>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* Selected products */}
      {selectedSlugs.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {selectedSlugs.map((slug) => {
            const product = nameMap.get(slug);
            const displayName = product?.name ?? slug;

            return (
              <span
                key={slug}
                className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm text-gray-700"
              >
                <span className="truncate max-w-[200px]">{displayName}</span>
                <button
                  type="button"
                  onClick={() => handleRemove(slug)}
                  className="ml-1 rounded p-0.5 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <XMarkIcon className="h-3.5 w-3.5" />
                </button>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
