import { AnimatePresence, motion } from "framer-motion";
import Image from "next/future/image";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { IFrame } from "../../../providers/supabase/interfaces/I_supabase";
import useMediaQuery, { useWindowDimensions } from "../../../utils/hooks";
import ScaleUpBtn from "../../buttons/ScaleUpBtn";

export const SliderFrameT1 = ({ frame }: { frame: IFrame }) => {
  const imgRef = useRef<HTMLDivElement | null>(null);
  const { vw, windowHeight } = useAutoSrcsetSize(imgRef, frame.id);
  const isLarge = useMediaQuery("(min-width: 768px)");
  const [isZoomed, setIsZoomed] = useState(false);
  const isDynamic = isLarge && !isZoomed;

  return (
    <AnimatePresence>
      <motion.div
        key={frame.id}
        className={` w-screen  md:mx-auto h-full flex-shrink-0 flex items-center justify-center relative`}
        style={{ height: `${windowHeight}px` }}
      >
        <div
          className={` md:w-[90%] w-full  flex items-center justify-center h-[80%] overflow-hidden transition-all duration-500 `}
        >
          <div
            className={`${
              isZoomed ? "scale-[200%]" : "scale-[100%]"
            } w-full h-full flex items-center justify-center  transition-all duration-500`}
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
                  style={getAnimationScaleOrigin(
                    isLarge,
                    frame.images[0].position
                  )}
                  className={`  z-10 w-full  touch-none md:aspect-[${
                    img.width
                  }/${img.height}]  ${getImageSize(img.size)} ${getImageLayout(
                    img.position
                  )}`}
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
                    // sizes={isDynamic ? `${vw}vw` : "90vw"}
                    sizes={getImageSrcsetSize(img.size, isZoomed)}
                  />
                </motion.div>
              );
            })}
          </div>
        </div>
        <div className="absolute z-50 bottom-[70px] right-10">
          <ScaleUpBtn handleClick={() => setIsZoomed(!isZoomed)} />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

// Hooks and helpers:

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
  const left = `mx-4 md:ml-[15%] md:mr-auto`;
  const right = "mx-4 md:mr-[15%] md:ml-auto";
  const center = "mx-4 md:mx-4";
  const cover = "mx-4 md:m-0";

  if (position === "left") return left;
  if (position === "right") return right;
  if (position === "center") return center;
  if (position === "cover") return cover;
  return "";
};

const getFrameSize = (size: string, color_theme: string) => {
  if (size === "full" && color_theme === "default") return "w-screen";
  return "max-w-screen-xl mx-auto w-full";
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

const getImageSrcsetSize = (
  size: "small" | "large" | "full",
  isZoomed: boolean
) => {
  const small = isZoomed
    ? "calc(100vw - 36px)"
    : "(min-width: 550px) calc(100vw - (100vw - 500px)), calc(100vw - 36px)";
  const large = isZoomed
    ? "calc(100vw - 36px)"
    : "(min-width: 768px) calc(100vw - (100vw - 700px)), calc(100vw - 36px)";
  const full = "calc(100vw - 36px)";

  if (size === "small") return small;
  if (size === "large") return large;
  if (size === "full") return full;
  return "";
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

// Animations:

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

export const SliderFrameToPreloadT1 = ({ frame }: { frame: IFrame }) => {
  const imgRef = useRef<HTMLDivElement | null>(null);
  const { vw, windowHeight } = useAutoSrcsetSize(imgRef, frame.id);
  const isZoomed = false;

  return (
    <div
      key={frame.id}
      className={` h-full w-screen overscroll-contain  flex-shrink-0 flex items-center justify-center absolute left-0 top-0 opacity-0 -z-10`}
      style={{ height: `${windowHeight}px` }}
    >
      {frame.images.map((img) => {
        return (
          <div
            ref={imgRef}
            className={`z-10 w-full touch-none md:aspect-[${img.width}/${
              img.height
            }]  ${getImageSize(img.size)} mx-4 md:mx-4`}
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
              sizes={getImageSrcsetSize(img.size, isZoomed)}
            />
          </div>
        );
      })}
    </div>
  );
};
