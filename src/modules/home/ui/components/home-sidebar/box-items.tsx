"use client";
import { BoxesIcon, BoxIcon, ChevronRight } from "lucide-react";
import React, { useState } from "react";
import { twMerge } from "tailwind-merge";
import CubeSection from "./cube-section";
import { trpc } from "@/trpc/client";

interface BoxItemProps {
  item: any;
  selected?: boolean;
}

const BoxItem = ({ item }: BoxItemProps) => {
  const [showCubes, setShowCubes] = useState(false);
  return (
    <div>
      <div
        className="flex items-center justify-between w-full cursor-pointer hover:bg-muted-foreground/10 rounded-md"
        onClick={() => setShowCubes((val) => !val)}
      >
        <div className="text-sm flex items-center gap-2 pl-1 py-0.5">
          <BoxesIcon className="size-4 text-md md:text-sm" />
          <span className="text-md md:text-sm">{item.title}</span>
        </div>
        <ChevronRight
          className={twMerge(
            "text-muted-foreground size-4",
            showCubes ? "rotate-90" : ""
          )}
        />
      </div> 
      {showCubes && (
          <div className="overflow-hidden transition-all duration-300 w-full h-full flex gap-2 pl-4 mt-3">
            <CubeSection key={item.title} box={item.title} />
          </div>
        )}         
    </div>
  );
};

export default BoxItem;
