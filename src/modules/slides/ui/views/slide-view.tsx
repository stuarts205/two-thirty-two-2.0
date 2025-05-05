"use client";
import React from "react";
import SlideSection from "../sections/slide-section";
import { useParams } from "next/navigation";

const SlideView = () => {
  const params = useParams();
  const boxcube = params?.boxCubeId || "";
  const box = typeof boxcube === "string" ? boxcube.split("_")[0] : "";
  const cube = typeof boxcube === "string" ? boxcube.split("_")[1] : "";

  return (
    <div>
      <SlideSection
        box={box
          .slice(box.lastIndexOf("/") + 1)
          .replaceAll("%20", " ")
          .replaceAll("%20", " ")}
        cube={cube
          .slice(cube.lastIndexOf("/") + 1)
          .replaceAll("%20", " ")
          .replaceAll("%20", " ")}
      />
    </div>
  );
};

export default SlideView;
