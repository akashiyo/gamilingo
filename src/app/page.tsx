'use client'

import Image from "next/image";
import React from "react";
import Head from 'next/head';
import MyForm from './components/admin-form';

export default function Home() {
  return (
    <div className="font-sans items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <h1 className="text-2xl font-bold"> Homepage </h1>
      <main>
        <div>
          <Head>
            <title>My Next.js Form</title>
            <meta name="description" content="A simple form in Next.js" />
          </Head>
          <main>
            <h1>Welcome to My Form</h1>
            <MyForm />
          </main>
        </div>
      </main>
      <footer className="">
      </footer>
    </div>
  );
}
