import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4 py-12">
      <div className="flex w-full max-w-xl flex-col items-center gap-8 text-center">
        <div>
          <Image
            alt="The Smith family house"
            height="753"
            width="700"
            priority
            className="h-auto max-h-[60vh] w-auto"
            src="/images/image_house.jpg"
          />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            Smith Family Slides
          </h1>
        </div>
        <Link
          href="/home"
          className="group inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-7 py-3 text-base font-medium text-slate-900 shadow-md transition hover:bg-slate-50"
        >
          Continue
          <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}
