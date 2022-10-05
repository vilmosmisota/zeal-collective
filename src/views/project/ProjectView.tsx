import Image from "next/future/image";
import {
  IImage,
  IProject,
} from "../../providers/supabase/interfaces/I_supabase";
import { useEffect, useRef, useState } from "react";
import useSound from "use-sound";

export default function ProjectView({ data }: { data: IProject }) {
  const { images } = data;
  const [slide, setSlide] = useState(0);
  const [play] = useSound(data.click_sound_url);
  const sliderSection = useRef<null | HTMLElement>(null);
  const handleForward = () => {
    const limit = images.length - 1;
    if (slide === limit) return;
    setSlide((prev) => prev + 1);
    play();
  };

  const handleBackward = () => {
    if (slide === 0) return;
    setSlide((prev) => prev - 1);
    play();
  };

  const sounds = images.map((item) => item.sound_effect);

  const scrollToSlider = () => {
    if (!sliderSection.current) return;
    window.scrollTo({
      top: sliderSection.current.offsetTop,
      behavior: "smooth",
    });
  };
  return (
    <>
      <header className="h-screen w-screen relative bg-zinc50 overflow-hidden">
        <div className="mt-16">
          <h1>{data.title}</h1>
          <h3>{data.description}</h3>
          <p>Artist</p>
          <button onClick={scrollToSlider}>Play</button>
        </div>
      </header>
      <main
        ref={sliderSection}
        className="h-screen w-screen relative bg-zinc50 overflow-hidden"
      >
        <div className={`flex w-full items-center overflow-hidden`}>
          <SliderItem sliderItem={images[slide]} title={data.title} />
          {/* {images.map((item) => {
            return (
              <SliderBackgroundSound
                sound={item.sound_effect}
                key={item.url}
                current={sounds[slide]}
              />
            );
          })} */}
        </div>
      </main>
      <section className="fixed bg-zinc800 h-[60px] w-screen bottom-0 left-0 flex items-center justify-evenly">
        <BackwardBtn handleClick={handleBackward} />
        <ForwardBtn handleClick={handleForward} />
      </section>
    </>
  );
}

type ForwardBtnProps = {
  handleClick: () => void;
};
const ForwardBtn = ({ handleClick }: ForwardBtnProps) => {
  return (
    <button onClick={handleClick}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="#fff"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 8.688c0-.864.933-1.405 1.683-.977l7.108 4.062a1.125 1.125 0 010 1.953l-7.108 4.062A1.125 1.125 0 013 16.81V8.688zM12.75 8.688c0-.864.933-1.405 1.683-.977l7.108 4.062a1.125 1.125 0 010 1.953l-7.108 4.062a1.125 1.125 0 01-1.683-.977V8.688z"
        />
      </svg>
    </button>
  );
};

type BackwardBtnProps = {
  handleClick: () => void;
};

const BackwardBtn = ({ handleClick }: BackwardBtnProps) => {
  return (
    <button onClick={handleClick}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="#fff"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 16.811c0 .864-.933 1.405-1.683.977l-7.108-4.062a1.125 1.125 0 010-1.953l7.108-4.062A1.125 1.125 0 0121 8.688v8.123zM11.25 16.811c0 .864-.933 1.405-1.683.977l-7.108-4.062a1.125 1.125 0 010-1.953L9.567 7.71a1.125 1.125 0 011.683.977v8.123z"
        />
      </svg>
    </button>
  );
};

const SliderItem = ({
  sliderItem,
  title,
}: {
  sliderItem: IImage;
  title: string;
}) => {
  return (
    <div
      className={`h-screen w-screen flex-shrink-0 flex items-center  justify-center px-4 ]`}
    >
      <div
        className={`${
          sliderItem.width > sliderItem.height
            ? "max-w-[600px]"
            : "max-w-[400px]"
        }`}
      >
        <Image
          src={sliderItem.url}
          alt={title}
          width={sliderItem.width}
          height={sliderItem.height}
          className="res-img"
          loading="eager"
          quality={100}
          sizes="(max-width: 700px) 95vw,
                    (max-width: 1200px) 80vw,
                    40vw"
        />
      </div>
    </div>
  );
};

type SliderBackgroundSoundProps = {
  sound: string;
  current: string;
};

const SliderBackgroundSound = ({
  sound,
  current,
}: SliderBackgroundSoundProps) => {
  const [isActive, setIsActive] = useState(false);
  const [play, { stop }] = useSound(sound);
  // console.log("slide", slide);
  // console.log("prev", prev);

  useEffect(() => {
    if (sound !== current) {
      stop();
      return;
    }
    play();

    return () => stop();
  }, [sound, current, play, stop]);

  return (
    <>
      <input hidden readOnly value="text" name={sound} />
    </>
  );
};
