import React from 'react'
import Image from "next/image";

export const dynamic = 'force-dynamic';

const Home = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center -mt-16 p-4 md:p-12">
      <Image
        alt="Logo"
        height="753"
        width="700"
        className="mx-auto w-auto mt-0 p-4 md:p-0"
        src="/images/default.jpg"
      />    
    </div>
  )
}

export default Home

