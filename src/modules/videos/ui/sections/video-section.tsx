"use client";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { getVideoByLinkId, videos } from "@/lib/lookups";
import YouTube from "react-youtube";

interface VideoSectionProps {
  linkId: string;
}

export const VideoSectionSuspense = ({ linkId }: VideoSectionProps) => {
  const video = getVideoByLinkId(linkId);
  const moreVideos = videos.filter((item) => item.linkId !== linkId);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 md:px-8 lg:flex-row">
      <div className="min-w-0 flex-1 space-y-4">
        <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-lg">
          <YouTube
            videoId={video?.linkId}
            className="size-full"
            iframeClassName="size-full"
            opts={{ width: "100%", height: "100%" }}
          />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">{video?.name}</h1>
      </div>
      <aside className="w-full space-y-3 lg:w-80 lg:shrink-0">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          More videos
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
          {moreVideos.map((item) => (
            <Link
              key={item.linkId}
              href={`/videos/${item.linkId}`}
              className="group flex items-center gap-3 rounded-xl p-1.5 transition-colors hover:bg-muted"
            >
              <div className="aspect-video w-36 shrink-0 overflow-hidden rounded-lg bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://i.ytimg.com/vi/${item.linkId}/mqdefault.jpg`}
                  alt=""
                  loading="lazy"
                  className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <p className="line-clamp-2 text-sm font-medium leading-snug group-hover:text-primary">
                {item.name}
              </p>
            </Link>
          ))}
        </div>
      </aside>
    </div>
  );
};

const VideoSectionSkeletion = () => {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-4 px-4 py-6 md:px-8">
      <Skeleton className="aspect-video w-full rounded-2xl" />
      <Skeleton className="h-7 w-64" />
    </div>
  );
};

const VideoSection = ({ linkId }: VideoSectionProps) => {
  return (
    <Suspense fallback={<VideoSectionSkeletion />}>
      <ErrorBoundary fallback={<p>Error</p>}>
        <VideoSectionSuspense linkId={linkId} />
      </ErrorBoundary>
    </Suspense>
  );
};

export default VideoSection;
