export default function Flashcard() {
  return (
    <div className="flashcard-wrapper flex flex-col w-80 h-96 rounded-lg justify-center items-center [perspective:1000px]">
      <div
        className={
          "relative w-full h-full transition-all rounded-lg shadow-lg bg-[var(--dark-purple)] duration-500 [transform-style:preserve-3d] [backface-visibility:hidden] hover:[transform:rotateY(180deg)]"
        }
      >
        {/*card content on front side*/}
        <div className="front absolute inset-0 overflow-y-auto">a</div>
        {/*card content on back side*/}
        <div className="back absolute inset-0 rounded-lg shadow-lg bg-orange-200 [transform:rotateY(180deg)] [backface-visibility:hidden]">
          b
        </div>
      </div>
    </div>
  );
}