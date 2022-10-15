import Image from "next/future/image";
import {
  IFrame,
  IImage,
  IProject,
} from "../../providers/supabase/interfaces/I_supabase";
import {
  MutableRefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import useSound from "use-sound";
import { motion, AnimatePresence } from "framer-motion";

import { ProjectProps } from "../../pages/project/[slug]";
import { useLogger, useWindowDimensions } from "../../utils/hooks";
import GrainCanvas from "../../components/canvas/GrainCanvas";

export default function ProjectView({ project }: ProjectProps) {
  console.log(project);
  // const { images } = data;
  const [frameIndex, setFrameIndex] = useState(0);
  // const [play] = useSound(data.click_sound_url);
  const { height: windowHeight } = useWindowDimensions();

  const handleForward = () => {
    const limit = project.frames.length - 1;
    if (frameIndex === limit) return;
    setFrameIndex((prev) => prev + 1);
    console.log(frameIndex);
  };

  const handleBackward = () => {
    if (frameIndex === 0) return;
    setFrameIndex((prev) => prev - 1);
  };

  // const sounds = images.map((item) => item.sound_effect);

  useLogger(frameIndex + 1);

  return (
    <>
      {/* <header className="h-full  w-screen relative bg-zinc50 overflow-hidden">
        <div className="mt-16">
          <h1>{data.title}</h1>
          <h3>{data.description}</h3>
          <p>Artist</p>
        </div>
      </header> */}

      <main
        className={`border-2 w-screen overscroll-contain overflow-hidden relative bg-zinc50`}
        style={{ height: `${windowHeight}px` }}
      >
        <div className={`flex w-full items-center`}>
          {/* <AnimatePresence> */}
          <GrainCanvas />
          <SliderFrame frame={project.frames[frameIndex]} />
          {project.frames.length > frameIndex + 1 && (
            <SliderFrameToPreload frame={project.frames[frameIndex + 1]} />
          )}
          {/* {images.map((item) => {
            return (
              <SliderBackgroundSound
                sound={item.sound_effect}
                key={item.url}
                current={sounds[slide]}
              />
            );
          })} */}
          {/* </AnimatePresence> */}
        </div>
      </main>
      <section className="z-30 fixed bottom-0 left-0 bg-zinc800 h-[60px] w-screen  flex items-center justify-evenly">
        <div className=" flex ">
          <BackwardBtn handleClick={handleBackward} />
          <PlayBtn />
          <ForwardBtn handleClick={handleForward} />
        </div>
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
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6 text-peach400"
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
        stroke="currentColor"
        className="w-6 h-6 text-peach400"
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

const PlayBtn = () => {
  return (
    <button className="mx-4">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6 text-peach400"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
        />
      </svg>
    </button>
  );
};

const SliderFrame = ({ frame }: { frame: IFrame }) => {
  const imgRef = useRef<HTMLDivElement | null>(null);
  const { vw, windowHeight } = useAutoSrcsetSize(imgRef, frame.id);

  return (
    <AnimatePresence>
      <motion.div
        key={frame.id}
        className={`${getFrameTheme(
          frame.color_theme
        )} h-full w-screen overscroll-contain  flex-shrink-0 flex items-center justify-center`}
        style={{ height: `${windowHeight}px` }}
      >
        {frame.images.map((img, i) => {
          return (
            <motion.div
              animate={{
                opacity: 1,
                transition: { duration: 1, delay: i > 0 ? i * 0.5 : 1 },
              }}
              initial={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              ref={imgRef}
              className={`z-10 w-full touch-none md:aspect-[${img.width}/${
                img.height
              }]  ${getImageSize(img.size)} ${getImageLayout(img.position)}`}
              key={img.url}
            >
              <Image
                src={img.url}
                alt={"title"}
                width={img.width}
                height={img.height}
                className=" md:object-cover md:h-full md:w-full w-full h-auto"
                loading="eager"
                quality={100}
                sizes={`${vw}vw`}
              />
            </motion.div>
          );
        })}
      </motion.div>
    </AnimatePresence>
  );
};

const getImageLayout = (position: "left" | "center" | "right" | "cover") => {
  const left = "mx-4 md:ml-4 md:mr-auto";
  const right = "mx-4 md:mr-4 md:ml-auto";
  const center = "mx-4 md:mx-4";
  const cover = "mx-4 md:m-0";

  if (position === "left") return left;
  if (position === "right") return right;
  if (position === "center") return center;
  if (position === "cover") return cover;
  return "";
};

const getImageSize = (size: "small" | "large" | "full") => {
  const small = "md:max-w-[500px]";
  const large = "md:max-w-[700px]";
  const full = " md:w-screen md:h-screen";

  if (size === "small") return small;
  if (size === "large") return large;
  if (size === "full") return full;
  return "";
};

type SliderBackgroundSoundProps = {
  sound: string;
  current: string;
};

const getFrameTheme = (theme: "light" | "dark") => {
  const dark = "bg-zinc800";
  const light = "bg-zinc50";
  if (theme === "light") return light;
  if (theme === "dark") return dark;
  return "";
};

const SliderBackgroundSound = ({
  sound,
  current,
}: SliderBackgroundSoundProps) => {
  const [isActive, setIsActive] = useState(false);
  const [play, { stop }] = useSound(sound);

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

const useAutoSrcsetSize = (
  ref: MutableRefObject<HTMLDivElement | null>,
  id: number
) => {
  const [vw, setVw] = useState(0);
  const [width, setWidth] = useState(0);
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  useEffect(() => {
    if (!ref.current) return;
    setWidth(ref.current.offsetWidth);
  }, [ref, id]);

  useEffect(() => {
    if (width === 0 && windowWidth === 0) return;
    setVw(Math.floor((width / windowWidth) * 100));
  }, [width, windowWidth, vw, id]);

  return { vw, windowHeight };
};

const SliderFrameToPreload = ({ frame }: { frame: IFrame }) => {
  const imgRef = useRef<HTMLDivElement | null>(null);
  const { vw, windowHeight } = useAutoSrcsetSize(imgRef, frame.id);

  return (
    <div
      key={frame.id}
      className={`${getFrameTheme(
        frame.color_theme
      )} h-full w-screen overscroll-contain  flex-shrink-0 flex items-center justify-center absolute left-0 top-0 opacity-0 -z-10`}
      style={{ height: `${windowHeight}px` }}
    >
      {frame.images.map((img) => {
        return (
          <div
            ref={imgRef}
            className={`z-10 w-full touch-none md:aspect-[${img.width}/${
              img.height
            }]  ${getImageSize(img.size)} ${getImageLayout(img.position)}`}
            key={img.url}
          >
            <Image
              src={img.url}
              alt={"title"}
              width={img.width}
              height={img.height}
              className=" md:object-cover md:h-full md:w-full w-full h-auto"
              loading="eager"
              quality={100}
              sizes={`${vw}vw`}
            />
          </div>
        );
      })}
    </div>
  );
};
