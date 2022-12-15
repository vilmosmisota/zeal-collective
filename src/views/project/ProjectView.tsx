/* eslint-disable @typescript-eslint/no-misused-promises */
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

import { useUIEffectMix } from "../../providers/audio/uiSoundEffectsMix";
import {
  TSounds,
  useSoundEffectMix,
} from "../../providers/audio/backingSoundEffectsMix";
import { useSoundtrackMix } from "../../providers/audio/soundtrackMix";
import { BigPlayBtn } from "../../components/buttons/BigPlayBtn";
import { motion } from "framer-motion";

const sounds = [
  {
    name: "airpad",
    path: "/sounds/tracks/airpad.flac",
    gain: 0.6,
    frame: [0, 1, 2, 3, 4, 5, 6, 7],
  },
  {
    name: "elements",
    path: "/sounds/tracks/elements-section.flac",
    gain: 0.6,
    frame: [],
  },
  {
    name: "choir",
    path: "/sounds/tracks/choir.flac",
    gain: 0.6,
    frame: [3, 4],
  },
  {
    name: "bass",
    path: "/sounds/tracks/bass2.flac",

    gain: 0.6,
    frame: [2, 3, 4, 7, 8],
  },
  {
    name: "deeptech",
    path: "/sounds/tracks/deeptech.flac",
    gain: 0.6,
    frame: [4, 5, 6, 7, 8],
  },
];

const sEffects: TSounds[][] = [
  [
    {
      name: "seaside",
      path: "/sounds/effects/seaside.flac",
      gain: 0.3,
      pan: 1,
      loop: true,
      repeat: false,
      random_start: false,
      buff_state: "empty",
    },
    {
      name: "thunder1",
      path: "/sounds/effects/thunder1.flac",
      gain: 0.1,
      pan: -1,
      loop: false,
      repeat: false,
      random_start: false,
      buff_state: "empty",
    },
    {
      name: "thunder2",
      path: "/sounds/effects/thunder2.flac",
      gain: 0.1,
      pan: 1,
      loop: false,
      repeat: false,
      random_start: false,
      buff_state: "empty",
    },
  ],
  [
    {
      name: "seawash",
      path: "/sounds/effects/walking-in-water.flac",
      gain: 0.3,
      pan: 1,
      loop: true,
      repeat: false,
      random_start: false,
      buff_state: "empty",
    },
  ],
  [
    {
      name: "ocean-pulse",
      path: "/sounds/effects/ocean-wave-pulse.flac",
      gain: 0.3,
      pan: -1,
      loop: true,
      repeat: false,
      random_start: false,
      buff_state: "empty",
    },
    {
      name: "crushing-wave",
      path: "/sounds/effects/crushing-wave.flac",
      gain: 0.3,
      pan: -1,
      loop: false,
      repeat: false,
      random_start: false,
      buff_state: "empty",
    },
  ],
  [
    {
      name: "rocky-coast",
      path: "/sounds/effects/rocky-coast.flac",
      gain: 0.5,
      pan: 0,
      loop: true,
      repeat: false,
      random_start: false,
      buff_state: "empty",
    },
  ],
  [
    {
      name: "ocean-pulse",
      path: "/sounds/effects/ocean-wave-pulse.flac",
      gain: 0.3,
      pan: 0,
      loop: true,
      repeat: false,
      random_start: false,
      buff_state: "empty",
    },
    {
      name: "crushing-wave",
      path: "/sounds/effects/crushing-wave.flac",
      gain: 0.3,
      pan: -1,
      loop: false,
      repeat: false,
      random_start: false,
      buff_state: "empty",
    },
  ],
  [
    {
      name: "underwater",
      path: "/sounds/effects/underwater.flac",
      gain: 0.5,
      pan: 0,
      loop: true,
      repeat: false,
      random_start: false,
      buff_state: "empty",
    },
  ],
];

const clickSound = "/sounds/effects/camera-shutter.flac";

export default function ProjectView({ project }: ProjectProps) {
  const [frameIndex, setFrameIndex] = useState(0);
  const { height: windowHeight } = useWindowDimensions();
  const [isStarted, setIsStarted] = useState(false);

  const [analyzer, setAnalyzer] = useState<AnalyserNode | null>(null);

  const [actx, setActx] = useState<null | AudioContext>(null);
  const [masterGain, setMasterGain] = useState<null | GainNode>(null);
  const initializerAudioRef = useRef<HTMLAudioElement | null>(null);
  const [masterVolume, setMasterVolume] = useState(0.7);
  const [muted, setMuted] = useState(false);
  const finalVolume = muted ? 0 : masterVolume;
  const { startSoundtracks, isSoundtracksLoaded, playSoundtrack } =
    useSoundtrackMix();
  const { startSoundEffects, preLoadEffect, playSound } = useSoundEffectMix();
  const soundBarRef = useRef<HTMLCanvasElement | null>(null);
  const { loadClickBuffer, playClick } = useUIEffectMix();

  const handleStart = async () => {
    if (!actx || !initializerAudioRef.current) return;
    initializerAudioRef.current.play().catch((err) => console.warn(err));
    setIsStarted(true);
    const mgain = actx.createGain();
    const mAnalyser = actx.createAnalyser();
    mgain.gain.value = finalVolume;
    await startSoundtracks(actx, mgain, mAnalyser, sounds).catch((err) =>
      console.warn(err)
    );
    await loadClickBuffer(actx, clickSound).catch((err) => console.warn(err));
    await startSoundEffects(sEffects[0], actx, mgain).catch((err) =>
      console.warn(err)
    );
    await preLoadEffect(sEffects[1], actx, mgain, 1).catch((err) =>
      console.warn(err)
    );
    setActx(actx);
    setMasterGain(mgain);
    setAnalyzer(mAnalyser);
  };

  const handleForward = async () => {
    const limit = project.frames.length - 1;
    if (frameIndex === limit) return;
    setFrameIndex((prev) => prev + 1);
    playSoundtrack(frameIndex + 1);
    if (!actx) return;
    if (!masterGain) return;
    playClick(actx);
    playSound(frameIndex + 1);
    await preLoadEffect(
      sEffects[frameIndex + 2],
      actx,
      masterGain,
      frameIndex + 2
    );
  };

  const handleBackward = () => {
    if (frameIndex === 0) return;
    setFrameIndex((prev) => prev - 1);
    playSoundtrack(frameIndex - 1);
    if (!actx) return;
    playClick(actx);

    playSound(frameIndex - 1);
  };

  const handleMute = () => {
    if (!actx) return;
    masterGain?.gain.setValueAtTime(1, actx.currentTime);
    masterGain?.gain.linearRampToValueAtTime(0, actx.currentTime + 2);
    setMuted(true);
  };

  useEffect(() => {
    const soundBar = soundBarRef.current;
    if (!soundBar) return;

    let x;
    let animationFrameId: number;

    const soundBarCtx = soundBar.getContext("2d");

    if (!analyzer) return;
    analyzer.fftSize = 64;
    const fftLength = analyzer.fftSize;

    const barWidth = soundBar.width / fftLength;

    function animate() {
      if (!soundBarCtx || !soundBar || !analyzer) return;
      soundBarCtx.clearRect(0, 0, soundBar.width, soundBar.height);
      const frequencyData = new Uint8Array(analyzer.frequencyBinCount);
      analyzer.getByteFrequencyData(frequencyData);
      x = 2;
      for (let i = 0; i < frequencyData.length; i++) {
        const barHeight = frequencyData[i] / 10;

        soundBarCtx.fillStyle = "rgba(237, 234, 208, 0.2)";

        soundBarCtx.fillRect(x, soundBar.height - barHeight, 6, barHeight);

        x += barWidth + 6;
      }

      animationFrameId = window.requestAnimationFrame(animate);
    }
    animate();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [analyzer]);

  useEffect(() => {
    let ignore = false;
    if (ignore) return;
    const audioCtx = new AudioContext();
    const audioElement = initializerAudioRef.current;
    if (!audioElement) return;

    audioElement.volume = 0;
    const audioSource = audioCtx.createMediaElementSource(audioElement);
    audioSource.connect(audioCtx.destination);
    setActx(audioCtx);

    return () => {
      ignore = true;
      audioCtx.close().catch((err) => console.warn(err));
    };
  }, []);

  return (
    <>
      <main
        className={` w-screen overscroll-contain overflow-hidden relative bg-zinc50`}
        style={{ height: `${windowHeight}px` }}
      >
        <audio ref={initializerAudioRef} src={clickSound} autoPlay></audio>

        <IntroT1
          title={project.title}
          description={project.description}
          name={`${project.artists.first_name} ${project.artists.last_name}`}
          featured_img={project.featured_img}
          isStarted={isStarted}
          isSoundtracksLoaded={isSoundtracksLoaded}
        />

        {isStarted && isSoundtracksLoaded && (
          <SliderWrapperT1>
            <motion.div
              initial={{ boxShadow: "0 0 0px rgba(0,0,0,0.2) inset" }}
              animate={{ boxShadow: "0 0 50px rgba(0,0,0,0.2) inset" }}
              transition={{ duration: 1, delay: 1 }}
              className="absolute -z-1 top-[50%] left-0 w-full h-[calc(100%_-_120px)] -translate-y-2/4"
            ></motion.div>
            <GrainCanvas />
            <SliderFrameT1 frame={project.frames[frameIndex]} />
            {project.frames.length > frameIndex + 1 && (
              <SliderFrameToPreloadT1 frame={project.frames[frameIndex + 1]} />
            )}
          </SliderWrapperT1>
        )}

        {isStarted && isSoundtracksLoaded && (
          <section className="z-30 fixed bottom-[70px] h-6 w-full">
            <div className="absolute left-5 top-2">
              <p className="text-xs text-zinc600">
                {`${frameIndex + 1} / ${project.frames.length}`}
              </p>
            </div>
          </section>
        )}

        <section className="z-30 fixed bottom-0 left-0 bg-black h-[60px] w-screen flex items-center">
          <div className="mx-auto w-full max-w-[300px] flex items-center justify-between px-2">
            {isStarted && isSoundtracksLoaded ? (
              <>
                <div className="absolute bottom-0 left-[50%] -translate-x-[50%] h-[25px] ">
                  <canvas
                    className=""
                    ref={soundBarRef}
                    width={100}
                    height={25}
                  />
                </div>

                <ControlBtnsT1
                  handleBackward={handleBackward}
                  handleForward={handleForward}
                  handleMute={handleMute}
                />
              </>
            ) : (
              <div className=" w-full mx-3 relative flex justify-center items-center">
                <BigPlayBtn handleStart={handleStart} />
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
