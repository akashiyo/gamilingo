import Image from "next/image";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
        <h1> Homepage </h1>
          <main>
            
          </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <h2> Footer </h2>
        <div> <a href="/"> Conditions générales de vente </a></div>
        <div> <a href="/"> Politique de confidentialité </a></div>
      </footer>
    </div>
  );
}
