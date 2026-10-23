"use client";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { trpc } from "@/trpc/client";
import { ChevronRight, HomeIcon, ImageIcon, VideoIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import BoxItem from "./box-items";
import { videos } from "@/lib/lookups";
import VideoItems from "./video-items";

type Section = "Slides" | "Videos";

const MainSection = () => {
  const pathname = usePathname();
  const { state, setOpen, setOpenMobile } = useSidebar();
  const { data: boxes = [], isLoading } = trpc.boxes.getBoxes.useQuery();
  const [openSections, setOpenSections] = useState<Record<Section, boolean>>({
    Slides: pathname.startsWith("/slides"),
    Videos: pathname.startsWith("/videos"),
  });

  useEffect(() => {
    if (pathname.startsWith("/slides"))
      setOpenSections((value) => ({ ...value, Slides: true }));
    if (pathname.startsWith("/videos"))
      setOpenSections((value) => ({ ...value, Videos: true }));
  }, [pathname]);

  const toggleSection = (section: Section) => {
    if (state === "collapsed") {
      setOpen(true);
      setOpenSections((value) => ({ ...value, [section]: true }));
      return;
    }
    setOpenSections((value) => ({ ...value, [section]: !value[section] }));
  };

  const sectionButton = (
    section: Section,
    Icon: React.ComponentType,
    isActive: boolean,
  ) => (
    <SidebarMenuButton
      tooltip={section}
      isActive={isActive}
      onClick={() => toggleSection(section)}
      className="h-10 rounded-full px-3 font-medium"
    >
      <Icon />
      <span>{section}</span>
      <ChevronRight
        className={twMerge(
          "ml-auto size-4 text-muted-foreground transition-transform duration-200",
          openSections[section] ? "rotate-90" : "",
        )}
      />
    </SidebarMenuButton>
  );

  return (
    <div className="flex flex-col gap-2 py-3">
      <SidebarGroup className="py-0">
        <SidebarGroupContent>
          <SidebarMenu className="gap-1">
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="Home"
                asChild
                isActive={pathname === "/home"}
                className="h-10 rounded-full px-3 font-medium"
              >
                <Link href="/home" onClick={() => setOpenMobile(false)}>
                  <HomeIcon />
                  <span>Home</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              {sectionButton(
                "Slides",
                ImageIcon,
                pathname.startsWith("/slides") && !openSections.Slides,
              )}
              {openSections.Slides && (
                <SidebarMenuSub className="mr-0 mt-1 gap-0.5 pr-0">
                  {isLoading &&
                    Array.from({ length: 4 }).map((_, index) => (
                      <SidebarMenuSubItem key={index}>
                        <SidebarMenuSkeleton />
                      </SidebarMenuSubItem>
                    ))}
                  {boxes.map((item) => (
                    <SidebarMenuSubItem key={item.id}>
                      <BoxItem item={item} />
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              )}
            </SidebarMenuItem>
            <SidebarMenuItem>
              {sectionButton(
                "Videos",
                VideoIcon,
                pathname.startsWith("/videos") && !openSections.Videos,
              )}
              {openSections.Videos && (
                <SidebarMenuSub className="mr-0 mt-1 gap-0.5 pr-0">
                  {videos.map((video) => (
                    <SidebarMenuSubItem key={video.linkId}>
                      <VideoItems video={video} />
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              )}
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </div>
  );
};

export default MainSection;
