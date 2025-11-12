'use client';

import Image from "next/image";
import React from "react";
import Head from "next/head";
import "./home.css";

export default function Home() {
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

            {/* Logo GAMILINGOW */}
            <img
                className="absolute z-0 select-none opacity-60 w-[85vw] max-w-[800px]"
                src="/GAMILINGOW.svg"
                alt="gamilingo"
                style={{
                    bottom: "25%", // on le remonte un peu plus
                    left: "50%",
                    transform: "translateX(-50%)",
                    objectFit: "contain",
                }}
            />

            {/* Dragon et bouton */}
            <div
                className="absolute left-1/2 -translate-x-1/2 w-full flex justify-center z-10"
                style={{
                    bottom: "12%", // ✅ au lieu de bottom-0 → remonte le dragon sur mobile
                }}
            >
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
                        className="absolute left-1/2 -translate-x-1/2 bottom-[11%] px-7 py-3 bg-indigo-600 text-white rounded-full font-semibold shadow-lg hover:bg-indigo-700 active:scale-95 transition"
                        onClick={() => (window.location.href = '/login')}
                    >
                        C’est parti
                    </button>
                </div>
            </div>
        </div>
    );
}
