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
    // <div className="flex flex-col justify-center items-center w-full gap-4 mt-12">
    //   <h1 className="text-2xl font-bold">{video?.name}</h1>
    //   <div className="h-full w-full max-w-2xl video-responsive">
    //     <YouTube
    //       videoId={video?.linkId}
    //       opts={{ width: "100%", height: "400px" }}
    //     />
    //   </div>
    // </div>
    <div className="h-full flex flex-col md:px-24">
      <h1 className="text-2xl font-bold px-4 py-4">{video?.name}</h1>
      <div className="p-5">
        <YouTube
          videoId={video?.linkId}
          opts={{ width: "100%", height: "600px" }}
        />
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
