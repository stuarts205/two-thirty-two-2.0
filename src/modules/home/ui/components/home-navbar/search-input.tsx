"use client";

import { trpc } from "@/trpc/client";
import { SearchIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useId, useState } from "react";
import Lightbox from "yet-another-react-lightbox";

const SearchInput = () => {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const resultsId = useId();
  const {
    data: slides = [],
    isFetching,
    isError,
  } = trpc.slides.search.useQuery({ query }, { enabled: !!query });
  const isSearching = isFetching || query !== value.trim();

  useEffect(() => {
    const timeout = setTimeout(() => setQuery(value.trim()), 300);

    return () => clearTimeout(timeout);
  }, [value]);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextQuery = value.trim();
    if (!nextQuery) return;

    setQuery(nextQuery);
    setOpen(false);
    router.push(`/slides/search?query=${encodeURIComponent(nextQuery)}`);
  };

  return (
    <>
      <form
        role="search"
        onSubmit={onSubmit}
        onKeyDown={(event) => {
          if (event.key === "Escape") setOpen(false);
        }}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget))
            setOpen(false);
        }}
        className="relative flex w-full min-w-0 max-w-[600px]"
      >
        <div className="relative w-full min-w-0">
          <input
            type="search"
            aria-label="Search slides"
            aria-controls={open ? resultsId : undefined}
            placeholder="Search..."
            maxLength={200}
            value={value}
            onChange={(event) => {
              setValue(event.target.value);
              setOpen(!!event.target.value.trim());
              if (!event.target.value.trim()) setQuery("");
            }}
            onFocus={() => {
              if (value.trim()) setOpen(true);
            }}
            className="w-full pl-4 py-2 pr-12 rounded-l-full border focus:outline-none focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          aria-label="Search slides"
          title="Search slides"
          disabled={!value.trim()}
          className="px-3 sm:px-5 py-2.5 bg-gray-100 border-l-0 rounded-r-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <SearchIcon className="size-5" />
        </button>
        {open && (
          <div
            id={resultsId}
            aria-label="Slide search results"
            aria-busy={isSearching}
            className="absolute top-full left-0 right-0 mt-2 max-h-[min(70vh,36rem)] overflow-y-auto rounded-md border bg-white shadow-lg"
          >
            <p
              role="status"
              className="px-4 py-3 text-sm text-muted-foreground"
            >
              {isSearching
                ? "Searching slides..."
                : isError
                  ? "Unable to search slides. Please try again."
                  : slides.length === 0
                    ? "No matching slides found."
                    : `${slides.length === 50 ? "First 50" : slides.length} matching slides`}
            </p>
            {!isSearching && !isError && (
              <ul>
                {slides.map((slide, index) => (
                  <li key={slide.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedIndex(index);
                        setOpen(false);
                      }}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-gray-100 focus-visible:bg-gray-100 focus-visible:outline-none"
                    >
                      <Image
                        src={slide.slidename}
                        alt=""
                        width={64}
                        height={48}
                        unoptimized
                        className="h-12 w-16 shrink-0 rounded-sm object-contain"
                      />
                      <span className="min-w-0 flex-1 space-y-1">
                        <span className="block break-words text-sm font-medium">
                          {slide.title || slide.slidename.split("/").pop()}
                        </span>
                        {slide.description && (
                          <span className="block line-clamp-2 break-words text-sm text-muted-foreground">
                            {slide.description}
                          </span>
                        )}
                        {(slide.people || slide.approxDate) && (
                          <span className="block break-words text-xs text-muted-foreground">
                            {[slide.people, slide.approxDate]
                              .filter(Boolean)
                              .join(" | ")}
                          </span>
                        )}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </form>
      <Lightbox
        open={selectedIndex >= 0}
        close={() => setSelectedIndex(-1)}
        index={Math.max(selectedIndex, 0)}
        slides={slides.map((slide) => ({
          src: slide.slidename,
          alt: slide.title || slide.description || "Slide",
        }))}
      />
    </>
  );
};

export default SearchInput;
