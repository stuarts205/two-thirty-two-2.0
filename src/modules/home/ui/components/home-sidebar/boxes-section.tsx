"use client";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { trpc } from "@/trpc/client";
import React, { useState } from "react";
import BoxItem from "./box-items";

const BoxesSection = () => {  
  const [boxes] = trpc.boxes.getBoxes.useSuspenseQuery(); 

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarGroupLabel>Boxes</SidebarGroupLabel>
        <SidebarMenu className="w-full py-4 mb-12 gap-4">
          {boxes.map((item) => (
            <SidebarMenuItem key={item.id} className="w-full flex flex-col gap-4 px-3">
              <BoxItem item={item} />
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default BoxesSection;
