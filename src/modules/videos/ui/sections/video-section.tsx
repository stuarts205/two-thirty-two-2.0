"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchParams } from "next/navigation";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { getVideoByLinkId } from "@/lib/lookups";
import YouTube from "react-youtube";

interface VideoSectionProps {
  linkId: string;
}

export const VideoSectionSuspense = ({ linkId }: VideoSectionProps) => {
  const searchParams = useSearchParams();
  const video = getVideoByLinkId(linkId);

  return (
    <div className="flex flex-col justify-center py-24">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">{video?.name}</h1>
        <div className="w-full max-w-2xl">
          <YouTube videoId={video?.linkId} opts={{ width: "100%", height: "400px" }} />
        </div>
      </div>
    </div>
  );
};

const VideoSectionSkeletion = () => {
  return (
    <div className="flex flex-col gap-y-2">
      <Skeleton className="h-6 w-24" />
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
