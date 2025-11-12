'use client'

import Image from "next/image";
import React from "react";
import Head from 'next/head';

export default function Home() {
  return (
    <div className="font-sans min-h-screen flex flex-col items-center justify-center">
      <main>
        <div>
          <main>
            <h1 
              className="absolute text-gray-300 uppercase font-extrabold text-[10rem] md:text-[15rem] leading-none"
              style={{ left: '100px', right: '100px', bottom: '20%' }}
            >
              GAMILINGOW
            </h1>

            <div className="relative z-10 ">
              <Image 
                src="/vodka.png" 
                alt="Mon Vodka" 
                width={900} 
                height={1200} 
            />

            <div className="absolute z-[15]">
              {/* visible call-to-action button */}
              <button name="lesgo" id="lesgo_home" type="button" className="px-4 py-2 bg-blue-600 text-white rounded">C'est parti</button>
            </div>

      </div>
          </main>
        </div>
      </main>
      <footer className="">
      </footer>
    </div>
  );
}
