"use client";
import { BoxesIcon, ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { twMerge } from "tailwind-merge";
import CubeSection from "./cube-section";

interface BoxItemProps {
  item: any;
  selected?: boolean;
}

const BoxItem = ({ item }: BoxItemProps) => {
  const pathname = decodeURIComponent(usePathname());
  const isCurrentBox = pathname.startsWith(`/slides/${item.title}_`);
  const [showCubes, setShowCubes] = useState(isCurrentBox);

  return (
    <div>
      <button
        type="button"
        aria-expanded={showCubes}
        className={twMerge(
          "flex h-8 w-full items-center gap-2 rounded-full px-2 text-left text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
          isCurrentBox ? "font-medium text-sidebar-accent-foreground" : "",
        )}
        onClick={() => setShowCubes((val) => !val)}
      >
        <BoxesIcon className="size-4 shrink-0" />
        <span className="flex-1 truncate">{item.title}</span>
        <ChevronRight
          className={twMerge(
            "size-3.5 shrink-0 text-muted-foreground transition-transform duration-200",
            showCubes ? "rotate-90" : "",
          )}
        />
      </button>
      {showCubes && (
        <div className="ml-4 mt-0.5 border-l border-sidebar-border pl-2">
          <CubeSection key={item.title} box={item.title} />
        </div>
      )}
    </div>
  );
};

export default BoxItem;
