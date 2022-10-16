import { useState } from "react";

import { ProjectProps } from "../../pages/project/[slug]";
import { useLogger, useWindowDimensions } from "../../utils/hooks";
import GrainCanvas from "../../components/canvas/GrainCanvas";
import { ForwardBtn } from "../../components/buttons/ForwardBtn";
import { BackwardBtn } from "../../components/buttons/BackwardBtn";
import { PlayBtn } from "../../components/buttons/PlayBtn";

import { PauseBtn } from "../../components/buttons/PauseBtn";
import IntroT1 from "../../components/project/intro/IntroT1";
import SliderWrapperT1 from "../../components/project/slider/SliderWrapperT1";
import {
  SliderFrameT1,
  SliderFrameToPreloadT1,
} from "../../components/project/slider/SliderFrameT1";
import ControlBtnsT1 from "../../components/project/controlBar/ControlBtnsT1";
import PlayBarT1 from "../../components/project/controlBar/PlayBarT1";

export default function ProjectView({ project }: ProjectProps) {
  console.log(project);

  const [frameIndex, setFrameIndex] = useState(0);
  const { height: windowHeight } = useWindowDimensions();
  const [isStarted, setIsStarted] = useState(false);
  const [isPausePlay, setIsPausePlay] = useState(false);
  const [barSize, setBarSize] = useState((1 / project.frames.length) * 98);

  const handleStart = () => {
    setIsStarted(true);
    setIsPausePlay(true);
  };

  const handlePausePlay = () => {
    setIsPausePlay(!isPausePlay);
  };

  const handleForward = () => {
    const limit = project.frames.length - 1;
    if (frameIndex === limit) return;
    setFrameIndex((prev) => prev + 1);
    setBarSize((prev) => prev + (1 / project.frames.length) * 98);
  };

  const handleBackward = () => {
    if (frameIndex === 0) return;
    setFrameIndex((prev) => prev - 1);
    setBarSize((prev) => prev - (1 / project.frames.length) * 98);
  };

  useLogger(barSize);

  return (
    <>
      <main
        className={` w-screen overscroll-contain overflow-hidden relative bg-zinc50`}
        style={{ height: `${windowHeight}px` }}
      >
        {!isStarted && (
          <IntroT1
            title={project.title}
            description={project.description}
            name={`${project.artists.first_name} ${project.artists.last_name}`}
            featured_img={project.featured_img}
            handleClick={handleStart}
          />
        )}

        {isStarted && (
          <SliderWrapperT1>
            <GrainCanvas />
            <SliderFrameT1 frame={project.frames[frameIndex]} />
            {project.frames.length > frameIndex + 1 && (
              <SliderFrameToPreloadT1 frame={project.frames[frameIndex + 1]} />
            )}
          </SliderWrapperT1>
        )}
      </main>
      {isStarted && (
        <section className="z-30 fixed bottom-0 left-0 bg-zinc800 h-[60px] w-screen flex items-center">
          <div className="mx-auto w-full max-w-screen-md flex items-center justify-between px-2">
            <div className="w-2/6 max-w-[200px] flex items-center justify-center">
              <div className=" text-peach400">Sound</div>
            </div>

            <ControlBtnsT1
              handleBackward={handleBackward}
              isPausePlay={isPausePlay}
              handleForward={handleForward}
              handlePausePlay={handlePausePlay}
            />
            <PlayBarT1
              barSize={barSize}
              frameIndex={frameIndex}
              length={project.frames.length}
            />
          </div>
        </section>
      )}
    </>
  );
}

// const SliderBackgroundSound = ({
//   sound,
//   current,
// }: SliderBackgroundSoundProps) => {
//   const [isActive, setIsActive] = useState(false);
//   const [play, { stop }] = useSound(sound);

//   useEffect(() => {
//     if (sound !== current) {
//       stop();
//       return;
//     }
//     play();

//     return () => stop();
//   }, [sound, current, play, stop]);

//   return (
//     <>
//       <input hidden readOnly value="text" name={sound} />
//     </>
//   );
// };
