"use client";
import { Separator } from "@/components/ui/separator";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { trpc } from "@/trpc/client";
import { HomeIcon, ImageIcon, VideoIcon } from "lucide-react";
import React, { useState } from "react";
import BoxItem from "./box-items";
import { videos } from "@/lib/lookups";
import VideoItems from "./video-items";

const items = [
  {
    title: "Home",
    url: "/home",
    icon: HomeIcon,
  },
  {
    title: "Slides",
    url: "/slides",
    icon: ImageIcon,
    auth: true,
  },
  {
    title: "Videos",
    url: "/videos",
    icon: VideoIcon,
  },
];

const MainSection = () => {
  const [activeMenu, setActiveMenu] = useState("Home");
  const [boxes] = trpc.boxes.getBoxes.useSuspenseQuery();
  const videoList = videos;

  return (
    <div className="flex flex-col gap-4 px-4 py-2">
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  tooltip={item.title}
                  asChild
                  isActive={activeMenu === item.title}
                >
                  <div
                    className="flex items-center gap-4 cursor-pointer"
                    onClick={() => setActiveMenu(item.title)}
                  >
                    <item.icon />
                    <span className="text-sm">{item.title}</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
          {activeMenu === "Slides" && (
            <div className="flex flex-col gap-4">
              <Separator />
              <SidebarContent>
                <SidebarMenu className="w-full py-2 mb-12 gap-4">
                  {boxes.map((item) => (
                    <SidebarMenuItem
                      key={item.id}
                      className="w-full flex flex-col gap-4 px-3"
                    >
                      <BoxItem item={item} />
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarContent>
            </div>
          )}
          {activeMenu === "Videos" && (
            <div className="flex flex-col gap-4">
              <Separator />
              <SidebarContent>
                <SidebarMenu className="w-full py-2 mb-12 gap-2">
                  {videoList.map((video) => (
                    <SidebarMenuItem
                      key={video.linkId}
                    >
                      <VideoItems video={video} />
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarContent>
            </div>
          )}
        </SidebarGroupContent>
      </SidebarGroup>
    </div>
  );
};

export default MainSection;
