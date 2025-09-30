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

            <div className="relative z-10">
              <Image 
                src="/Vodka.png" 
                alt="Mon Vodka" 
                width={900} 
                height={1200} 
            />
            
      </div>
          </main>
        </div>
      </main>
      <footer className="">
      </footer>
    </div>
  );
}
