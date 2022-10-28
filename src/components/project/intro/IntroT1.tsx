import Image from "next/future/image";
import { BigPlayBtn } from "../../buttons/BigPlayBtn";

type IntroTemplate1Props = {
  title: string;
  description: string;
  name: string;
  featured_img: string;
  handleClick: () => void;
  handleSounds: () => void;
};

export default function IntroT1({
  title,
  description,
  name,
  featured_img,
  handleClick,
  handleSounds,
}: IntroTemplate1Props) {
  return (
    <header className="absolute top-0 p-4 left-0 h-full w-full z-40 bg-zinc50 overflow-y-scroll flex justify-center items-center flex-col md:flex-row">
      <div className="mt-20 text-center mb-6 md:w-[50%] md:mr-6 max-w-lg">
        <h1 className=" font-sansHeading font-black uppercase">{title}</h1>
        <p>by</p>
        <h3 className="mb-4 md:mb-12">{name}</h3>
        <p className="text">{description}</p>
        <button onClick={handleSounds}>Load sounds</button>
      </div>
      <div
        onClick={handleClick}
        className="max-w-[500px] min-w-full md:min-w-min md:max-w-lg md:w-[50%] max-h-[500px]  mb-6 relative"
      >
        <div className="mb-5 w-full h-full aspect-square  relative filter brightness-50 ">
          <Image
            src={featured_img}
            alt={title}
            fill
            className="cover-img rounded-xl"
          />
        </div>
        <div className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]">
          <BigPlayBtn />
        </div>
      </div>
    </header>
  );
}
