"use client";
import { VideoIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

interface VideoItemProps {
  video: any;
  selected?: boolean;
}

const VideoItems = ({ video }: VideoItemProps) => {
  return (
    <div className="flex items-center gap-3 w-full cursor-pointer hover:bg-muted-foreground/10 rounded-md p-2">
        <Link
          href={`/videos/${video.linkId}`}
          className="flex items-center gap-2 w-full"
          onClick={() => {}}
        >
          <VideoIcon className="shrink-0 size-4" />
          <span>{video.name}</span>
        </Link>        
    </div>    
  );
};

export default VideoItems;
