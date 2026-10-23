import { useSidebar } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/trpc/client";
import { BoxIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { twMerge } from "tailwind-merge";

interface CubeSectionProps {
  box: string;
}

const CubeSection = ({ box }: CubeSectionProps) => {
  const { data: cubes = [], isLoading } = trpc.boxes.getCubes.useQuery({
    box: box,
  });
  const pathname = decodeURIComponent(usePathname());
  const { setOpenMobile } = useSidebar();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-1 py-1">
        <Skeleton className="h-6 w-3/4 rounded-full" />
        <Skeleton className="h-6 w-2/3 rounded-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-0.5 py-0.5">
      {cubes.map((item) => {
        const href = `/slides/${box}_${item.id}`;
        const isActive = pathname === href;

        return (
          <Link
            key={item.id}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={twMerge(
              "flex h-7 items-center gap-2 rounded-full px-2 text-[13px] text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              isActive
                ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                : "",
            )}
            onClick={() => setOpenMobile(false)}
          >
            <BoxIcon className="size-3 shrink-0" />
            <span className="truncate">{item.id}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default CubeSection;
