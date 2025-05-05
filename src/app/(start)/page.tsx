import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8">
      <Image
        alt="Logo"
        height="753"
        width="700"
        className="mx-auto w-auto"
        src="/images/image_house.jpg"
      />
      <div className="mt-6 text-center">
        <Link className="text-2xl hover:text-gray-500" href='/home'>Continue</Link>
      </div>      
    </div>
  );
}
