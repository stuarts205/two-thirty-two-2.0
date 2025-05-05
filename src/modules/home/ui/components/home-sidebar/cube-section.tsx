import { useSidebar } from "@/app/sidebar-context";
import { trpc } from "@/trpc/client";
import { BoxIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { use } from "react";

interface CubeSectionProps {
  box: string;
}

const CubeSection = ({ box }: CubeSectionProps) => {
  const [cubes] = trpc.boxes.getCubes.useSuspenseQuery({ box: box });
  const router = useRouter();
  const { closeSidebar } = useSidebar();
  
  return (
    <div className="flex flex-col gap-2 w-full">
      {cubes.map((item) => (
        <Link
          href={`/slides/${box}_${item.id}`}
          className="flex items-center gap-2 cursor-pointer hover:bg-muted-foreground/10 rounded-md pl-1 py-0.5"
          onClick={closeSidebar}
        >
          <BoxIcon className="size-3" /> {item.id}
        </Link>
      ))}
    </div>
  );
};

export default CubeSection;
