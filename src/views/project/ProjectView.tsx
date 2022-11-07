import { useEffect, useRef, useState } from "react";

import { ProjectProps } from "../../pages/project/[slug]";
import { useLogger, useWindowDimensions } from "../../utils/hooks";
import GrainCanvas from "../../components/canvas/GrainCanvas";
import IntroT1 from "../../components/project/intro/IntroT1";
import SliderWrapperT1 from "../../components/project/slider/SliderWrapperT1";
import {
  SliderFrameT1,
  SliderFrameToPreloadT1,
} from "../../components/project/slider/SliderFrameT1";
import ControlBtnsT1 from "../../components/project/controlBar/ControlBtnsT1";
import PlayBarT1 from "../../components/project/controlBar/PlayBarT1";
import { AudioAnalyzer } from "../../utils/classes";
import { SoundOnBtn } from "../../components/buttons/SoundOnBtn";
import { AudioBuffers } from "../../utils/audioBuffer";
import { useAudioBuffer } from "../../providers/audio/audioBuffers";
import { useAudioMix } from "../../providers/audio/audioMix";

const sounds = [
  {
    name: "elements",
    path: "https://kyvqisljtzamvrttkpad.supabase.co/storage/v1/object/sign/soundtracks/elements-section.wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJzb3VuZHRyYWNrcy9lbGVtZW50cy1zZWN0aW9uLndhdiIsImlhdCI6MTY2Njk5MDU1OCwiZXhwIjoxOTgyMzUwNTU4fQ.rhUZWGy5JBhjwZbb0m0E5epydit9QN9AL5fSKiXctng",
    frame: [6, 7, 8],
  },
  {
    name: "airpad",
    path: "https://kyvqisljtzamvrttkpad.supabase.co/storage/v1/object/sign/soundtracks/airpad.wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJzb3VuZHRyYWNrcy9haXJwYWQud2F2IiwiaWF0IjoxNjY2NzMyMDY2LCJleHAiOjE5ODIwOTIwNjZ9.XsuWBFME1bFT6gtB7PgQA1KGDs-mzb3gHj8z3mZ5vaQ",
    frame: [4, 5, 6],
  },
  {
    name: "bass",
    path: "https://kyvqisljtzamvrttkpad.supabase.co/storage/v1/object/sign/soundtracks/bass2.wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJzb3VuZHRyYWNrcy9iYXNzMi53YXYiLCJpYXQiOjE2NjY3MzIxMzYsImV4cCI6MTk4MjA5MjEzNn0.YhdhO29428J_l3DJaVOx574MI7RZKrBvk2sX5SRoReE",

    frame: [0, 1, 2, 3, 4, 5, 6, 7, 8],
  },
  {
    name: "deeptech",
    path: "https://kyvqisljtzamvrttkpad.supabase.co/storage/v1/object/sign/soundtracks/deeptech.wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJzb3VuZHRyYWNrcy9kZWVwdGVjaC53YXYiLCJpYXQiOjE2NjY3MzIyNzksImV4cCI6MTk4MjA5MjI3OX0.qI0mah9TS4MPiQAbRffrmJTAnHSnEwNqWkzho_a2iAY",
    frame: [2, 3, 4, 5, 6],
  },
];

// const sounds = [
//   {
//     name: "elements",
//     path: "https://kyvqisljtzamvrttkpad.supabase.co/storage/v1/object/sign/soundtracks/elements-section.wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJzb3VuZHRyYWNrcy9lbGVtZW50cy1zZWN0aW9uLndhdiIsImlhdCI6MTY2Njk5MDU1OCwiZXhwIjoxOTgyMzUwNTU4fQ.rhUZWGy5JBhjwZbb0m0E5epydit9QN9AL5fSKiXctng",
//     isActive: true,
//   },
//   {
//     name: "airpad",
//     path: "https://kyvqisljtzamvrttkpad.supabase.co/storage/v1/object/sign/soundtracks/elements-section.wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJzb3VuZHRyYWNrcy9lbGVtZW50cy1zZWN0aW9uLndhdiIsImlhdCI6MTY2Njk5MDU1OCwiZXhwIjoxOTgyMzUwNTU4fQ.rhUZWGy5JBhjwZbb0m0E5epydit9QN9AL5fSKiXctng",
//     isActive: false,
//   },
//   {
//     name: "bass",
//     path: "https://kyvqisljtzamvrttkpad.supabase.co/storage/v1/object/sign/soundtracks/elements-section.wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJzb3VuZHRyYWNrcy9lbGVtZW50cy1zZWN0aW9uLndhdiIsImlhdCI6MTY2Njk5MDU1OCwiZXhwIjoxOTgyMzUwNTU4fQ.rhUZWGy5JBhjwZbb0m0E5epydit9QN9AL5fSKiXctng",
//     isActive: false,
//   },
//   {
//     name: "deeptech",
//     path: "https://kyvqisljtzamvrttkpad.supabase.co/storage/v1/object/sign/soundtracks/deeptech.wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJzb3VuZHRyYWNrcy9kZWVwdGVjaC53YXYiLCJpYXQiOjE2NjY3MzIyNzksImV4cCI6MTk4MjA5MjI3OX0.qI0mah9TS4MPiQAbRffrmJTAnHSnEwNqWkzho_a2iAY",
//     isActive: false,
//   },

// ];

export default function ProjectView({ project }: ProjectProps) {
  const [frameIndex, setFrameIndex] = useState(0);
  const { height: windowHeight } = useWindowDimensions();
  const [isStarted, setIsStarted] = useState(false);
  const [isPausePlay, setIsPausePlay] = useState(false);
  const [barSize, setBarSize] = useState((1 / project.frames.length) * 98);
  const mainSoundtrackRef = useRef<HTMLAudioElement | null>(null);
  // const [bufferState, setBufferState] = useState<null | AudioBuffer>(null);
  // const [bSource, setBSource] = useState<AudioBufferSourceNode | null>(null);
  // const [analyzer, setAnalyzer] = useState<AudioAnalyzer | null>(null);
  // const [audioBuffer, setAudioBuffer] = useState<[] | AudioBuffer[]>([]);
  // const b64 = useBase64(
  //   "https://kyvqisljtzamvrttkpad.supabase.co/storage/v1/object/sign/soundtracks/01.%20The%20Mark%20(Interlude).mp3?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJzb3VuZHRyYWNrcy8wMS4gVGhlIE1hcmsgKEludGVybHVkZSkubXAzIiwiaWF0IjoxNjY2MDIyMzY0LCJleHAiOjE5ODEzODIzNjR9._243msyX6P-sl_DDfgx4o33hzn0DjBWhM6_N4dXeD2Y"
  // );
  const [actx, setActx] = useState<null | AudioContext>(null);
  const [gainNode, setGainNode] = useState<GainNode | null>(null);
  const buffers = useAudioBuffer({ actx, sounds });
  // const buffersToPlay = useBuffersToPlay({ buffers, frameIndex });
  const soundBarRef = useRef<HTMLCanvasElement | null>(null);
  const { startSoundtrack, changeFrameSoundtrack } = useAudioMix({
    actx,
    buffers,
  });

  useLogger(buffers);

  const handleStart = () => {
    setIsStarted(true);
    setIsPausePlay(true);
    if (!buffers) return;
    if (!actx) return;
    const sounds = buffers;
    startSoundtrack();
  };

  const handleSounds = () => {
    const mactx = new AudioContext();
    setActx(mactx);
  };

  const handlePausePlay = () => {
    setIsPausePlay(!isPausePlay);
    if (!buffers) return;
    if (!actx) return;
  };

  const handleForward = () => {
    const limit = project.frames.length - 1;
    if (frameIndex === limit) return;
    setFrameIndex((prev) => prev + 1);
    setBarSize((prev) => prev + (1 / project.frames.length) * 98);
    changeFrameSoundtrack(frameIndex + 1);
    console.log(frameIndex);
  };

  const handleBackward = () => {
    if (frameIndex === 0) return;
    setFrameIndex((prev) => prev - 1);
    setBarSize((prev) => prev - (1 / project.frames.length) * 98);
    changeFrameSoundtrack(frameIndex - 1);
    console.log(frameIndex);
  };

  // useEffect(() => {
  //   if (!isStarted) return;
  //   const mainSoundRef = mainSoundtrackRef.current;
  //   if (!mainSoundRef) return;
  //   setAnalyzer(new AudioAnalyzer(mainSoundRef));
  // }, [isStarted]);

  // useEffect(() => {
  //   const mainSoundRef = mainSoundtrackRef.current;
  //   if (!mainSoundRef) return;

  //   if (isPausePlay) {
  //     mainSoundRef.play().catch((err) => console.warn(err));
  //   } else {
  //     mainSoundRef.pause();
  //   }
  // }, [isPausePlay]);

  // useEffect(() => {
  //   const soundBar = soundBarRef.current;

  //   if (!b64) return;
  //   if (!soundBar) return;
  //   if (!analyzer) return;

  //   let barHeight;
  //   let x;
  //   let animationFrameId: number;

  //   const soundBarCtx = soundBar.getContext("2d");

  //   const { fftLength } = analyzer.getFft();

  //   const barWidth = soundBar.width / fftLength;

  //   function animate() {
  //     if (!soundBarCtx) return;
  //     if (!soundBar) return;
  //     soundBarCtx.clearRect(0, 0, soundBar.width, soundBar.height);
  //     x = 0;
  //     if (!analyzer) return;
  //     const { freqData } = analyzer.getFft();
  //     for (let i = 0; i < fftLength; i++) {
  //       barHeight = freqData[i] / 3;

  //       soundBarCtx.fillStyle = "#EDDBD0";
  //       soundBarCtx.fillRect(
  //         x,
  //         soundBar.height - barHeight,
  //         barWidth,
  //         barHeight
  //       );
  //       x += barWidth;
  //     }
  //     animationFrameId = window.requestAnimationFrame(animate);
  //   }
  //   animate();

  //   return () => {
  //     window.cancelAnimationFrame(animationFrameId);
  //   };
  // }, [b64, analyzer]);

  // useEffect(() => {
  //   // const st = mainSoundtrackRef.current;
  //   // if (!st) return;

  //   const actx = new AudioContext();
  //   const fetchSong = async (path: string) => {
  //     const xhr = await fetch(path);
  //     const arrayBuffer = await xhr.arrayBuffer();
  //     return actx.decodeAudioData(arrayBuffer);
  //   };

  //   const setBufferFn = async () => {
  //     const aBuffer = await fetchSong(
  //       "https://kyvqisljtzamvrttkpad.supabase.co/storage/v1/object/sign/soundtracks/beat_1.wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJzb3VuZHRyYWNrcy9iZWF0XzEud2F2IiwiaWF0IjoxNjY2Mjk5NTgyLCJleHAiOjE5ODE2NTk1ODJ9.8pmjqjpn-xZyaZZyc2MZ0d1c6xDbGm4tH95TJX5pf78&t=2022-10-20T20%3A59%3A41.272Z"
  //     );
  //     setBufferState(aBuffer);
  //   };
  //   setBufferFn();

  //   if (!bufferState) return;
  //   const playSound = actx.createBufferSource();
  //   playSound.buffer = bufferState;
  //   playSound.connect(actx.destination);
  //   setBSource(playSound);
  // }, []);

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
            handleSounds={handleSounds}
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
            <div className="w-2/6 max-w-[200px] flex items-center justify-center flex-col">
              <div className="relative w-[100px] h-[25px]">
                <canvas
                  className=" border-2 rounded-lg"
                  ref={soundBarRef}
                  width={100}
                  height={25}
                />
                <div className="absolute top-2/4 left-2/4  -translate-x-[50%] -translate-y-2/4 ">
                  <SoundOnBtn />
                </div>
              </div>

              {/* <div className=" text-peach400">Sound</div> */}
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
          <audio
            ref={mainSoundtrackRef}
            crossOrigin="anonymous"
            src="https://kyvqisljtzamvrttkpad.supabase.co/storage/v1/object/sign/soundtracks/beat_1.wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJzb3VuZHRyYWNrcy9iZWF0XzEud2F2IiwiaWF0IjoxNjY2Mjk5NTgyLCJleHAiOjE5ODE2NTk1ODJ9.8pmjqjpn-xZyaZZyc2MZ0d1c6xDbGm4tH95TJX5pf78&t=2022-10-20T20%3A59%3A41.272Z"
            loop
          />
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

const useBase64 = (url: string) => {
  const [b64, setB64] = useState<null | string>(null);

  useEffect(() => {
    async function get(url: string) {
      const response = await fetch(url);
      const buff = await response.arrayBuffer();
      const base = Buffer.from(buff).toString("base64");
      setB64(base);
    }
    get(url).catch((err) => console.warn(err));
  }, [url]);
  return b64;
};
