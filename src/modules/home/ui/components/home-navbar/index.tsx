"use client";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import SearchInput from "./search-input";
import { SidebarTrigger } from "@/components/ui/sidebar";

const HomeNavbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white flex items-center px-2 pr-5 z-50">
      <div className="flex items-center gap-4 w-full">
        <div className="flex items-center flex-shrink-0">
          <SidebarTrigger />
          <Link prefetch href="/" className="flex items-center gap-1">
            <div className="flex items-center gap-1 p-4">
              <Image
                src="/images/default.jpg"
                alt="logo"
                width={40}
                height={40}
                className="rounded-sm"
              />
              <p className="text-2xl px-2 font-semibold tracking-tighter">
                Smith Family Slides
              </p>
            </div>
          </Link>
        </div>
        <div className="flex-1 md:flex justify-center max-w-[7000px] mx-auto hidden">
          <SearchInput />
        </div>
      </div>
    </nav>
  );
};

export default HomeNavbar;
