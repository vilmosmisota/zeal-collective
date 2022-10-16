import Image from "next/future/image";
import { IFrame } from "../../providers/supabase/interfaces/I_supabase";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import useSound from "use-sound";
import { motion, AnimatePresence } from "framer-motion";

import { ProjectProps } from "../../pages/project/[slug]";
import useMediaQuery, {
  useLogger,
  useWindowDimensions,
} from "../../utils/hooks";
import GrainCanvas from "../../components/canvas/GrainCanvas";
import { ForwardBtn } from "../../components/buttons/ForwardBtn";
import { BackwardBtn } from "../../components/buttons/BackwardBtn";
import { PlayBtn } from "../../components/buttons/PlayBtn";
import { BigPlayBtn } from "../../components/buttons/BigPlayBtn";
import { PauseBtn } from "../../components/buttons/PauseBtn";

export default function ProjectView({ project }: ProjectProps) {
  console.log(project);

  const [frameIndex, setFrameIndex] = useState(0);
  const { height: windowHeight } = useWindowDimensions();
  const [isStarted, setIsStarted] = useState(false);
  const [isPausedPlay, setIsPausedPlay] = useState(false);

  const handleStart = () => {
    setIsStarted(!isStarted);
    setIsPausedPlay(true);
  };

  const handlePausePlay = () => {
    setIsPausedPlay(!isPausedPlay);
  };

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

  useLogger(frameIndex + 1);

  return (
    <>
      <main
        className={` w-screen overscroll-contain overflow-hidden relative bg-zinc50`}
        style={{ height: `${windowHeight}px` }}
      >
        {!isStarted && (
          <header className="absolute top-0 p-4 left-0 h-full w-full z-40 bg-zinc50 overflow-y-scroll flex justify-center items-center flex-col md:flex-row">
            <div className="mt-20 text-center mb-6 md:w-[50%] md:mr-6 max-w-lg">
              <h1 className=" font-sansHeading font-black uppercase">
                {project.title}
              </h1>
              <p>by</p>
              <h3 className="mb-4 md:mb-12">{`${project.artists.first_name} ${project.artists.last_name} `}</h3>
              <p className="text">{project.description}</p>
            </div>
            <div
              onClick={handleStart}
              className="max-w-[500px] min-w-full md:min-w-min md:max-w-lg md:w-[50%] max-h-[500px]  mb-6 relative"
            >
              <div className="mb-5 w-full h-full aspect-square  relative filter brightness-50 ">
                <Image
                  src={project.featured_img}
                  alt={project.title}
                  fill
                  className="cover-img rounded-xl"
                />
              </div>
              <div className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]">
                <BigPlayBtn />
              </div>
            </div>
          </header>
        )}

        {isStarted && (
          <div className={`flex w-full items-center`}>
            <GrainCanvas />
            <SliderFrame frame={project.frames[frameIndex]} />
            {project.frames.length > frameIndex + 1 && (
              <SliderFrameToPreload frame={project.frames[frameIndex + 1]} />
            )}
          </div>
        )}
      </main>
      <section className="z-30 fixed bottom-0 left-0 bg-zinc800 h-[60px] w-screen  flex items-center justify-evenly">
        <div className=" flex ">
          <BackwardBtn handleClick={handleBackward} />
          {!isPausedPlay ? (
            <PlayBtn handleClick={handlePausePlay} />
          ) : (
            <PauseBtn handleClick={handlePausePlay} />
          )}

          <ForwardBtn handleClick={handleForward} />
        </div>
      </section>
    </>
  );
}

const SliderFrame = ({ frame }: { frame: IFrame }) => {
  const imgRef = useRef<HTMLDivElement | null>(null);
  const { vw, windowHeight } = useAutoSrcsetSize(imgRef, frame.id);
  const isLarge = useMediaQuery("(min-width: 768px)");

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
              variants={animateFrame}
              custom={i}
              animate={
                !isLarge && frame.images[0].position !== "center"
                  ? "animateScaleUp"
                  : "animateDefault"
              }
              initial={
                !isLarge && frame.images[0].position !== "center"
                  ? "initScaleUp"
                  : "initDefault"
              }
              exit={{ opacity: 0 }}
              ref={imgRef}
              style={getAnimationScaleOrigin(isLarge, frame.images[0].position)}
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
                sizes={isLarge ? `${vw}vw` : "90vw"}
              />
            </motion.div>
          );
        })}
      </motion.div>
    </AnimatePresence>
  );
};

const animateFrame = {
  initScaleUp: {
    opacity: 0,
    scale: 0.5,
  },

  animateScaleUp: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      duration: 1,
      delay: i > 0 ? i * 1.5 : 1,
      scale: { delay: 3, duration: 1 },
    },
  }),

  initDefault: {
    opacity: 0,
  },
  animateDefault: (i: number) => ({
    opacity: 1,
    transition: {
      duration: 1,
      delay: i > 0 ? i * 1.5 : 1,
    },
  }),
};

const getScaleAnimation = (isLarge: boolean, position: string) => {
  const scaleAnimation = !isLarge && position !== "center";

  if (scaleAnimation) return;
};

const getAnimationScaleOrigin = (mediaSize: boolean, position: string) => {
  const smallLeft = !mediaSize && position === "left";
  const smallRight = !mediaSize && position === "right";

  if (smallLeft) return { originX: 0 };
  if (smallRight) return { originX: 1 };
  return {};
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
  const light = "";
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
