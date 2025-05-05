"use client";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { BoxIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

const vidoes = [
  {
    title: "Boston's Graduation Speech",
    url: "/videos",
    icon: BoxIcon,
  },
];

const VideosSection = () => {
  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarGroupLabel>Boxes</SidebarGroupLabel>
        <SidebarMenu>
          {vidoes.map((video) => (
            <div className="flex flex-col items-center w-full justify-between">
              <SidebarMenuItem key={video.title}>
                  <SidebarMenuButton
                    tooltip={video.title}
                    asChild
                    isActive={false}
                    onClick={() => {}}
                  >
                    <Link className="flex items-center gap-4" href={video.url}>
                      <video.icon />
                      <span className="text-sm">{video.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
            </div>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default VideosSection;