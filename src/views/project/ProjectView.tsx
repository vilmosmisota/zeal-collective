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

import { ProjectProps } from "../../pages/project/[slug]";
import { useWindowDimensions } from "../../utils/hooks";

export default function ProjectView({ project }: ProjectProps) {
  console.log(project);
  // const { images } = data;
  const [frameIndex, setFrameIndex] = useState(0);
  // const [play] = useSound(data.click_sound_url);

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

  return (
    <>
      {/* <header className="h-screen w-screen relative bg-zinc50 overflow-hidden">
        <div className="mt-16">
          <h1>{data.title}</h1>
          <h3>{data.description}</h3>
          <p>Artist</p>
        </div>
      </header> */}

      <main className="h-screen w-screen relative bg-zinc50 overflow-hidden">
        <div className={`flex w-full items-center overflow-x-scroll`}>
          <SliderFrame frame={project.frames[frameIndex]} />
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

const SliderFrame = ({ frame }: { frame: IFrame }) => {
  const imgRef = useRef<HTMLDivElement | null>(null);
  const vw = useAutoSrcsetSize(imgRef, frame.id);

  useEffect(() => {
    console.log("vw", vw);
  }, [vw]);

  return (
    <div
      className={`h-screen w-screen flex-shrink-0 flex items-center justify-start md:justify-center md:overflow-hidden overflow-scroll`}
    >
      {frame.images.map((img) => {
        return (
          <div
            ref={imgRef}
            className={`w-full aspect-[${img.width}/${
              img.height
            }]  ${getImageSize(img.size)} ${getImageLayout(img.position)}`}
            key={img.url}
          >
            <Image
              src={img.url}
              alt={"title"}
              width={img.width}
              height={img.height}
              className="cover-img"
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

const getImageLayout = (position: "left" | "center" | "right" | "cover") => {
  const left = "ml-4 mr-auto";
  const right = "mr-4 ml-auto";
  const center = "mx-4";
  const cover = "m-0";

  if (position === "left") return left;
  if (position === "right") return right;
  if (position === "center") return center;
  if (position === "cover") return cover;
  return "";
};

const getImageSize = (size: "small" | "large" | "full") => {
  const small = "max-w-[500px]";
  const large = "max-w-[700px]";
  const full = "w-auto md:w-screen h-screen";

  if (size === "small") return small;
  if (size === "large") return large;
  if (size === "full") return full;
  return "";
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
  const { width: windowWidth } = useWindowDimensions();

  useEffect(() => {
    if (!ref.current) return;
    setWidth(ref.current.offsetWidth);
  }, [ref, id]);

  useEffect(() => {
    if (width === 0 && windowWidth === 0) return;
    setVw(Math.floor((width / windowWidth) * 100));
  }, [width, windowWidth, vw, id]);

  return vw;
};
