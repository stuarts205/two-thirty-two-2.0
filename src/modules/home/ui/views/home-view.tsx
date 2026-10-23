"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { videos } from "@/lib/lookups";
import { trpc } from "@/trpc/client";
import { BoxesIcon, BoxIcon, PlayIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const MAX_CUBES = 6;

const BoxCard = ({ title }: { title: string }) => {
  const { data: cubes = [], isLoading } = trpc.boxes.getCubes.useQuery({
    box: title,
  });
  const firstCube = cubes[0]?.id;

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <Link
        href={firstCube ? `/slides/${title}_${firstCube}` : "#"}
        aria-disabled={!firstCube}
        className="flex items-center justify-between gap-3 px-4 pt-4"
      >
        <h3 className="text-lg font-semibold leading-tight group-hover:text-primary">
          {title}
        </h3>
        <BoxesIcon className="size-6 shrink-0 text-muted-foreground transition-transform group-hover:scale-110" />
      </Link>
      <div className="flex flex-1 flex-col gap-3 px-4 pb-4 pt-2">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {isLoading
            ? "Loading cubes..."
            : `${cubes.length} cube${cubes.length === 1 ? "" : "s"}`}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {isLoading &&
            Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-7 w-16 rounded-full" />
            ))}
          {cubes.slice(0, MAX_CUBES).map((cube) => (
            <Link
              key={cube.id}
              href={`/slides/${title}_${cube.id}`}
              className="inline-flex h-7 items-center gap-1 rounded-full bg-muted px-3 text-xs font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <BoxIcon className="size-3" />
              {cube.id}
            </Link>
          ))}
          {cubes.length > MAX_CUBES && (
            <span className="inline-flex h-7 items-center rounded-full px-2 text-xs text-muted-foreground">
              +{cubes.length - MAX_CUBES} more
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const HomeView = () => {
  const { data: boxes = [], isLoading } = trpc.boxes.getBoxes.useQuery();

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-6 md:px-8 md:py-8">
      <section className="relative overflow-hidden rounded-3xl bg-slate-900 shadow-lg">
        <Image
          alt=""
          aria-hidden
          fill
          priority
          className="object-cover opacity-30 blur-md scale-110"
          src="/images/default.jpg"
        />
        <div className="relative flex flex-col gap-6 p-6 text-center sm:flex-row sm:p-10 sm:text-left">
          <Image
            alt="Smith family"
            height="753"
            width="700"
            priority
            className="h-auto w-full rounded-2xl object-contain shadow-xl ring-4 ring-white/20 sm:h-48 sm:w-auto sm:object-cover"
            src="/images/default.jpg"
          />
          <div className="space-y-3">
            <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Smith Family Slides
            </h1>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {isLoading &&
            Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-2xl" />
            ))}
          {boxes.map((box) => (
            <BoxCard key={box.id} title={box.title} />
          ))}
        </div>
      </section>
      <section className="space-y-4">
        <div className="flex items-baseline justify-between">
          <h2 className="text-xl font-semibold tracking-tight">Videos</h2>
          <span className="text-sm text-muted-foreground">
            {videos.length} videos
          </span>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
          {videos.map((video) => (
            <Link
              key={video.linkId}
              href={`/videos/${video.linkId}`}
              className="group space-y-2"
            >
              <div className="relative aspect-video overflow-hidden rounded-xl bg-muted shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://i.ytimg.com/vi/${video.linkId}/hqdefault.jpg`}
                  alt=""
                  loading="lazy"
                  className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/30">
                  <span className="flex size-11 items-center justify-center rounded-full bg-white/90 opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                    <PlayIcon className="ml-0.5 size-5 fill-slate-900 text-slate-900" />
                  </span>
                </div>
              </div>
              <p className="line-clamp-2 text-sm font-medium leading-snug group-hover:text-primary">
                {video.name}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomeView;
