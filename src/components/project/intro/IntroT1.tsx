import Image from "next/future/image";
import { BigPlayBtn } from "../../buttons/BigPlayBtn";

type IntroTemplate1Props = {
  title: string;
  description: string;
  name: string;
  featured_img: string;
  isStarted: boolean;
  isSoundtracksLoaded: boolean;
};

export default function IntroT1({
  title,
  description,
  isStarted,
  isSoundtracksLoaded,
}: IntroTemplate1Props) {
  return (
    <header
      className={`absolute ${
        isSoundtracksLoaded ? "-top-[100%]" : "top-0"
      }  p-4 left-0 h-full w-full z-20 bg-zinc50 overflow-y-auto`}
    >
      <div
        className={`${
          isStarted ? "opacity-0" : "opacity-100"
        } mt-20 text-center mb-6 md:w-[50%]  max-w-lg mx-auto`}
      >
        <h1 className=" font-sansHeading font-black uppercase mb-5">{title}</h1>

        <p className="text text-left">{description}</p>
      </div>
    </header>
  );
}
