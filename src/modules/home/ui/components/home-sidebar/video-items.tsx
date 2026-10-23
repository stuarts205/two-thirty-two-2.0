"use client";
import { useSidebar } from "@/components/ui/sidebar";
import { PlayIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { twMerge } from "tailwind-merge";

interface VideoItemProps {
  video: any;
  selected?: boolean;
}

const VideoItems = ({ video }: VideoItemProps) => {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();
  const href = `/videos/${video.linkId}`;
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      title={video.name}
      className={twMerge(
        "flex h-8 w-full items-center gap-2 rounded-full px-2 text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        isActive
          ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
          : "",
      )}
      onClick={() => setOpenMobile(false)}
    >
      <PlayIcon className="size-3.5 shrink-0" />
      <span className="truncate">{video.name}</span>
    </Link>
  );
};

export default VideoItems;
