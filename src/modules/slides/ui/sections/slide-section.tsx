"use client";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import React, { Suspense, useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { trpc } from "@/trpc/client";
import { useRouter } from "next/navigation";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Counter from "yet-another-react-lightbox/plugins/counter";
import "yet-another-react-lightbox/plugins/counter.css";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  ChevronDownIcon,
  ChevronsRightIcon,
  ImagePlusIcon,
  MoreVerticalIcon,
} from "lucide-react";
import SaveSlideInfoModal from "../components/save-slide-info-modal";
import { toast } from "sonner";

interface SlideSectionProps {
  box: string;
  cube: string;
}

export const SlideSectionSuspense = ({ box, cube }: SlideSectionProps) => {
  const router = useRouter();
  const utils = trpc.useUtils();

  const [slides] = trpc.slides.getSlides.useSuspenseQuery({ box, cube });
  const { data: boxes = [] } = trpc.boxes.getBoxes.useQuery();
  const [data, setData] = useState({ image: "", index: 0 });
  const [open, setOpen] = useState(false);
  const [imageSizes, setImageSizes] = useState<
    { width: number; height: number }[]
  >([]);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [slideInfoModalOpen, setSlideInfoModalOpen] = useState(false);
  const [selectedBox, setSelectedBox] = useState(box);
  const [selectedCube, setSelectedCube] = useState(cube);

  const { data: cubes = [] } = trpc.boxes.getCubes.useQuery(
    { box: selectedBox },
    { enabled: !!selectedBox },
  );

  useEffect(() => {
    const loadImages = async () => {
      const sizes = await Promise.all(
        (slides ?? []).map(
          (src) =>
            new Promise<{ width: number; height: number }>((resolve) => {
              const img = document.createElement("img");
              img.src = src.url;
              img.onload = () => {
                resolve({ width: img.naturalWidth, height: img.naturalHeight });
              };
            }),
        ),
      );
      setImageSizes(sizes);
    };

    loadImages();
  }, [slides]);

  useEffect(() => {
    setSelectedBox(box);
    setSelectedCube(cube);
  }, [box, cube]);

  const getScaledStyle = (w: number, h: number) => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const maxDisplaySize = Math.min(vw, vh) * 0.5;
    const scale = maxDisplaySize / Math.max(w, h);

    return {
      width: w * scale,
      height: h * scale,
    };
  };

  const viewImage = (image: string, index: number) => {
    if (!open) {
      setData({ image: "", index: 0 });
    }
    setOpen(true);
    setData({ image, index });
  };

  const openModal = (image: string) => {
    setImageUrl(image);
    setSlideInfoModalOpen(true);
  };

  const navigateToSlideRoute = (nextBox: string, nextCube: string) => {
    router.push(
      `/slides/${encodeURIComponent(nextBox)}_${encodeURIComponent(nextCube)}`,
    );
  };

  const onSelectBox = async (nextBox: string) => {
    setSelectedBox(nextBox);

    const nextCubes = await utils.boxes.getCubes.fetch({ box: nextBox });
    const hasCurrentCube = nextCubes.some((item) => item.id === selectedCube);
    const nextCube = hasCurrentCube ? selectedCube : nextCubes[0]?.id;

    if (!nextCube) {
      toast.error("No cubes found for this box");
      return;
    }

    setSelectedCube(nextCube);
    navigateToSlideRoute(nextBox, nextCube);
  };

  const onSelectCube = (nextCube: string) => {
    setSelectedCube(nextCube);
    navigateToSlideRoute(selectedBox, nextCube);
  };

  return (
    <>
      <SaveSlideInfoModal
        open={slideInfoModalOpen}
        onOpenChange={setSlideInfoModalOpen}
        image={imageUrl}
      />
      <div className="flex flex-col w-full gap-y-4">
        <div className="flex gap-y-2 w-full items-center gap-6 px-5">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                className="h-auto p-0 text-lg text-muted-foreground hover:bg-transparent hover:text-foreground"
              >
                <span>{selectedBox}</span>
                <ChevronDownIcon className="size-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Select box</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {boxes.map((item) => (
                <DropdownMenuItem
                  key={item.id}
                  onClick={() => onSelectBox(item.title)}
                >
                  {item.title}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <ChevronsRightIcon className="text-muted-foreground size-4" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                className="h-auto p-0 text-lg text-muted-foreground hover:bg-transparent hover:text-foreground"
              >
                <span>{selectedCube}</span>
                <ChevronDownIcon className="size-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Select cube</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {cubes.map((item) => (
                <DropdownMenuItem
                  key={item.id}
                  onClick={() => onSelectCube(item.id)}
                >
                  {item.id}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div>
          <Separator />
        </div>
        <div className="flex flex-col w-full">
          {imageSizes.length > 0 && (
            <Lightbox
              plugins={[Counter, Slideshow]}
              counter={{ container: { style: { top: 0, bottom: "unset" } } }}
              index={
                data.image
                  ? slides?.findIndex((slide) => slide.url === data.image)
                  : 0
              }
              open={open}
              close={() => setOpen(false)}
              slides={slides?.map((image, index) => ({
                src: image.url,
                alt: `image ${index + 1}`,
                width: imageSizes[index].width,
                height: imageSizes[index].height,
                style: getScaledStyle(
                  imageSizes[index].width,
                  imageSizes[index].height,
                ),
                srcSet: [
                  {
                    src: image.url,
                    width: imageSizes[index].width,
                    height: imageSizes[index].height,
                  },
                ],
              }))}
            />
          )}
          <div className="p-5">
            <ResponsiveMasonry
              columnsCountBreakPoints={{ 350: 3, 750: 4, 900: 5, 1300: 6 }}
            >
              <Masonry>
                {slides?.map((image, index) => (
                  <div key={index} className="p-0.5 relative group">
                    <img
                      key={index}
                      src={image.url}
                      alt={`Image ${index + 1}`}
                      style={{ display: "block", width: "100%" }}
                      className="rounded-xl overflow-hidden group cursor-pointer hover:opacity-75"
                      onClick={() => viewImage(image.url, index)}
                    />
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          type="button"
                          size="icon"
                          className="bg-black/50 hover:bg-black/50 absolute top-1 right-1 rounded-full opacity-70 md:opacity-0 transition-opacity  
                              group-hover:opacity-100 duration-300 size-7"
                        >
                          <MoreVerticalIcon className="text-white" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" side="right">
                        <DropdownMenuItem onClick={() => openModal(image.url)}>
                          <ImagePlusIcon className="size-4 mr-1" />
                          Add/Update info
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </Masonry>
            </ResponsiveMasonry>
          </div>
        </div>
      </div>
    </>
  );
};

const SlideSectionSkeletion = () => {
  return (
    <div className="flex flex-col gap-y-2">
      <Skeleton className="h-6 w-24" />
      <Skeleton className="h-4 w-32" />
    </div>
  );
};

const SlideSection = ({ box, cube }: SlideSectionProps) => {
  return (
    <Suspense fallback={<SlideSectionSkeletion />}>
      <ErrorBoundary fallback={<p>Error</p>}>
        <SlideSectionSuspense box={box} cube={cube} />
      </ErrorBoundary>
    </Suspense>
  );
};

export default SlideSection;
