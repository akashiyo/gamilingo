'use client';

import Image from "next/image";
import React from "react";
import Head from "next/head";
import "./home.css";
import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();
    
    return (
        <div
            className="relative h-screen w-screen flex flex-col items-center justify-center overflow-hidden bg-[#cfe3ff]"
        >

            <Head>
                <title>GAMILINGOW</title>
            </Head>

            {/* Nuages animés */}
            <Image
                src="/cloud1.svg"
                alt="Cloud"
                width={250}
                height={120}
                className="absolute animate-cloud1"
                style={{ top: "70%", left: "0px", width:"25%" }}
            />
            <Image
                src="/cloud1.svg"
                alt="Cloud"
                width={200}
                height={100}
                className="absolute animate-cloud2"
                style={{ bottom: "18%", right: "0px", width:"25%"  }}
            />
            <Image
                src="/cloud3.svg"
                alt="Cloud"
                width={280}
                height={140}
                className="absolute animate-cloud3"
                style={{ top: "5%", left: "100px", width:"15%" }}
            />
            <Image
                src="/cloud1.svg"
                alt="Cloud"
                width={280}
                height={140}
                className="absolute animate-cloud2"
                style={{ top: "13%", right: "120px" }}
            />


            <Image
                src="/cloud3.svg"
                alt="Cloud"
                width={280}
                height={140}
                className="absolute animate-cloud3"
                style={{ top: "45%", left: "400px", zIndex: 100}}
            />
            <Image
                src="/cloud3.svg"
                alt="Cloud"
                width={280}
                height={140}
                className="absolute animate-cloud3"
                style={{ bottom: "10", left: "250px", zIndex: 100}}
            />

            {/* Dragon et bouton */}
            <div
                className="absolute left-1/2 -translate-x-1/2 w-full flex flex-col items-center justify-center z-10"
                style={{
                    bottom: 0
                }}
            >
                {/* Logo GAMILINGOW */}
                <img
                    className="select-none opacity-60 w-[85vw] max-w-[800px] mb-4"
                    src="/GAMILINGOW.svg"
                    alt="gamilingo"
                    style={{
                        objectFit: "contain",
                    }}
                />
                
                <div className="relative w-[100vw] max-w-[700px]">
                    <Image
                        src="/vodka.png"
                        alt="Dragon GAMILINGOW"
                        width={500}
                        height={600}
                        className="w-full h-auto max-h-[80vh] object-contain select-none"
                        priority
                    />

                    {/* Bouton au-dessus du dragon */}
                    <button
                        type="button"
                        className="absolute left-1/2 -translate-x-1/2 bottom-[11%] px-7 py-3 text-white rounded-full font-semibold shadow-lg active:scale-95 transition"
                        onClick={() => router.push('/login')}
                        style={{
                            backgroundColor: "var(--dark-purple)",
                            bottom:"80px"
                        }}
                    >
                        C’est parti
                    </button>
                </div>
            </div>
        </div>
    );
}
