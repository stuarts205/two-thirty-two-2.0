"use client";
import React from "react";
import { useParams } from "next/navigation";
import VideoSection from "../sections/video-section";

const SlideView = () => {
  const params = useParams();
  const linkId = Array.isArray(params?.videoId) ? params.videoId[0] : params?.videoId || "";

  return (
    <div>
      <VideoSection
        linkId={linkId}
      />
    </div>
  );
};

export default SlideView;
