"use client";
import { Skeleton } from "@/components/ui/skeleton";
import React, { Suspense, useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { trpc } from "@/trpc/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import Masonry from "react-responsive-masonry";
import Lightbox from "yet-another-react-lightbox";
import Counter from "yet-another-react-lightbox/plugins/counter";
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
  ArrowLeftIcon,
  BoxesIcon,
  BoxIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ImageOffIcon,
  ImagePlusIcon,
  MoreVerticalIcon,
  PlayIcon,
  SearchXIcon,
} from "lucide-react";
import SaveSlideInfoModal from "../components/save-slide-info-modal";
import { toast } from "sonner";

const ResponsiveMasonry = dynamic(
  () =>
    import("react-responsive-masonry").then(
      (module) => module.ResponsiveMasonry,
    ),
  { ssr: false },
);

interface SlideSectionProps {
  box: string;
  cube: string;
  searchQuery?: string;
}

interface SlideGalleryProps extends SlideSectionProps {
  slides: { key?: string; url: string }[];
}

export const SlideSectionSuspense = ({ box, cube }: SlideSectionProps) => {
  const [slides] = trpc.slides.getSlides.useSuspenseQuery({ box, cube });

  return <SlideGallery box={box} cube={cube} slides={slides ?? []} />;
};

const SearchSlideSectionSuspense = ({ query }: { query: string }) => {
  const [results] = trpc.slides.search.useSuspenseQuery({ query });

  return (
    <SlideGallery
      box=""
      cube=""
      searchQuery={query}
      slides={results.map((slide) => ({ key: slide.id, url: slide.slidename }))}
    />
  );
};

const SlideGallery = ({
  box,
  cube,
  slides,
  searchQuery,
}: SlideGalleryProps) => {
  const router = useRouter();
  const utils = trpc.useUtils();

  const { data: boxes = [] } = trpc.boxes.getBoxes.useQuery(undefined, {
    enabled: !searchQuery,
  });
  const [data, setData] = useState({ image: "", index: 0 });
  const [open, setOpen] = useState(false);
  const [autoplay, setAutoplay] = useState(false);
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
      <div className="flex flex-col w-full">
        <div className="sticky top-16 z-30 flex flex-wrap items-center justify-between gap-3 border-b bg-background/80 px-4 py-3 backdrop-blur-xl md:px-6">
        <div className="flex min-w-0 items-center gap-2">
        <Button
          asChild
          variant="ghost"
          size="icon"
          className="size-9 shrink-0 rounded-full"
          title="Back to home"
        >
          <Link href="/home" aria-label="Back to home">
            <ArrowLeftIcon className="size-5" />
          </Link>
        </Button>
        {searchQuery ? (
          <div className="min-w-0 space-y-0.5">
            <h1 className="text-lg font-semibold tracking-tight break-words">
              Search results for &quot;{searchQuery}&quot;
            </h1>
            <p role="status" className="text-sm text-muted-foreground">
              {slides.length === 50
                ? "First 50 matching slides"
                : `${slides.length} matching slides`}
            </p>
          </div>
        ) : (
          <div className="flex min-w-0 flex-wrap items-center gap-1.5">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  className="h-9 rounded-full px-3 text-base font-semibold tracking-tight hover:bg-muted"
                >
                  <BoxesIcon className="size-4 text-muted-foreground" />
                  <span>{selectedBox}</span>
                  <ChevronDownIcon className="size-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="max-h-[60vh] overflow-y-auto rounded-xl"
              >
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
            <ChevronRightIcon className="text-muted-foreground/60 size-4" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  className="h-9 rounded-full bg-muted px-3 text-base font-medium hover:bg-accent hover:text-accent-foreground"
                >
                  <BoxIcon className="size-4 text-muted-foreground" />
                  <span>{selectedCube}</span>
                  <ChevronDownIcon className="size-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="max-h-[60vh] overflow-y-auto rounded-xl"
              >
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
            <span className="ml-1 text-sm text-muted-foreground">
              {slides.length} slide{slides.length === 1 ? "" : "s"}
            </span>
          </div>
        )}
        </div>
          {slides.length > 0 && (
            <Button
              type="button"
              variant="outline"
              className="h-9 rounded-full"
              onClick={() => {
                setAutoplay(true);
                viewImage(slides[0].url, 0);
              }}
            >
              <PlayIcon className="size-4" />
              Slideshow
            </Button>
          )}
        </div>
        <div className="flex flex-col w-full">
          {imageSizes.length > 0 && (
            <Lightbox
              plugins={[Counter, Slideshow]}
              counter={{ container: { style: { top: 0, bottom: "unset" } } }}
              slideshow={{ autoplay }}
              styles={{ container: { backgroundColor: "rgba(0, 0, 0, 0.95)" } }}
              index={
                data.image
                  ? slides?.findIndex((slide) => slide.url === data.image)
                  : 0
              }
              open={open}
              close={() => {
                setOpen(false);
                setAutoplay(false);
              }}
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
          <div className="p-2 md:p-4">
            {searchQuery && slides.length === 0 && (
              <div className="flex flex-col items-center gap-2 py-20 text-center">
                <SearchXIcon className="size-10 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">
                  No matching slides found.
                </p>
              </div>
            )}
            {!searchQuery && slides.length === 0 && (
              <div className="flex flex-col items-center gap-2 py-20 text-center">
                <ImageOffIcon className="size-10 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">
                  No slides in this cube yet.
                </p>
              </div>
            )}
            <ResponsiveMasonry
              columnsCountBreakPoints={{ 350: 3, 750: 4, 900: 5, 1300: 6 }}
            >
              <Masonry>
                {slides?.map((image, index) => (
                  <div key={index} className="p-0.5 md:p-1 relative group">
                    <div className="relative overflow-hidden rounded-lg bg-muted">
                      <img
                        key={index}
                        src={image.url}
                        alt={`Image ${index + 1}`}
                        loading="lazy"
                        style={{ display: "block", width: "100%" }}
                        className="cursor-pointer transition-transform duration-300 ease-out group-hover:scale-[1.03]"
                        onClick={() => viewImage(image.url, index)}
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          type="button"
                          size="icon"
                          aria-label="Slide options"
                          className="bg-black/40 hover:bg-black/60 backdrop-blur-sm absolute top-2 right-2 rounded-full opacity-80 md:opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 data-[state=open]:opacity-100 duration-300 size-7 shadow-none"
                        >
                          <MoreVerticalIcon className="text-white" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        side="right"
                        className="rounded-xl"
                      >
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

const SKELETON_HEIGHTS = ["h-40", "h-56", "h-48", "h-64", "h-44", "h-52"];

const SlideSectionSkeletion = () => {
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 border-b px-4 py-3 md:px-6">
        <Skeleton className="h-9 w-32 rounded-full" />
        <Skeleton className="h-9 w-24 rounded-full" />
      </div>
      <div className="grid grid-cols-3 gap-1 p-2 md:grid-cols-4 md:gap-2 md:p-4 lg:grid-cols-5 xl:grid-cols-6">
        {Array.from({ length: 18 }).map((_, index) => (
          <Skeleton
            key={index}
            className={`${SKELETON_HEIGHTS[index % SKELETON_HEIGHTS.length]} rounded-lg`}
          />
        ))}
      </div>
    </div>
  );
};

const SlideSection = ({ box, cube, searchQuery }: SlideSectionProps) => {
  return (
    <Suspense fallback={<SlideSectionSkeletion />}>
      <ErrorBoundary
        key={searchQuery || `${box}/${cube}`}
        fallback={
          <div className="flex flex-col items-center gap-2 py-20 text-center">
            <ImageOffIcon className="size-10 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">
              Something went wrong loading these slides.
            </p>
          </div>
        }
      >
        {searchQuery ? (
          <SearchSlideSectionSuspense query={searchQuery} />
        ) : (
          <SlideSectionSuspense box={box} cube={cube} />
        )}
      </ErrorBoundary>
    </Suspense>
  );
};

export default SlideSection;
