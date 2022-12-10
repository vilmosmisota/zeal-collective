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

const sounds = [
  {
    name: "airpad",
    path: "https://res.cloudinary.com/vilmosmisota/video/upload/v1667944686/media-app/Vilmos%20Misota/photos/airpad_cbvt0e.wav",
    gain: 0.6,
    frame: [0, 1, 2, 3, 4, 5, 6, 7],
  },
  {
    name: "elements",
    path: "https://res.cloudinary.com/vilmosmisota/video/upload/v1667944685/media-app/Vilmos%20Misota/photos/elements-section_yymltx.wav",
    gain: 0.6,
    frame: [],
  },
  {
    name: "choir",
    path: "https://res.cloudinary.com/vilmosmisota/video/upload/v1667944684/media-app/Vilmos%20Misota/photos/choir_iryevc.wav",
    gain: 0.6,
    frame: [3, 4],
  },
  {
    name: "bass",
    path: "https://res.cloudinary.com/vilmosmisota/video/upload/v1667945419/media-app/Vilmos%20Misota/photos/bass2_f8e27t.wav",

    gain: 0.6,
    frame: [2, 3, 4, 7, 8],
  },
  {
    name: "deeptech",
    path: "https://res.cloudinary.com/vilmosmisota/video/upload/v1667944684/media-app/Vilmos%20Misota/photos/deeptech_zst7gu.wav",
    gain: 0.6,
    frame: [4, 5, 6, 7, 8],
  },
];

const sEffects: TSounds[][] = [
  [
    {
      name: "seaside",
      path: "https://res.cloudinary.com/vilmosmisota/video/upload/v1669505153/media-app/Vilmos%20Misota/soundeffects/seaside_sql9ng.wav",
      gain: 0.3,
      pan: 1,
      loop: true,
      repeat: false,
      random_start: false,
      buff_state: "empty",
    },
    {
      name: "thunder1",
      path: "https://res.cloudinary.com/vilmosmisota/video/upload/v1669505148/media-app/Vilmos%20Misota/soundeffects/thunder1_aai5hx.wav",
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
      name: "seawash",
      path: "https://res.cloudinary.com/vilmosmisota/video/upload/v1669505152/media-app/Vilmos%20Misota/soundeffects/walking-in-water_gxcqxd.wav",
      gain: 0.3,
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
      path: "https://res.cloudinary.com/vilmosmisota/video/upload/v1669505150/media-app/Vilmos%20Misota/soundeffects/ocean-wave-pulse_abiw9i.wav",
      gain: 0.3,
      pan: 0,
      loop: true,
      repeat: false,
      random_start: false,
      buff_state: "empty",
    },
    {
      name: "crushing-wave",
      path: "https://res.cloudinary.com/vilmosmisota/video/upload/v1669505149/media-app/Vilmos%20Misota/soundeffects/crushing-wave_pm5nr8.wav",
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
      path: "https://res.cloudinary.com/vilmosmisota/video/upload/v1669505150/media-app/Vilmos%20Misota/soundeffects/rocky-coast_blb5mb.wav",
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
      path: "https://res.cloudinary.com/vilmosmisota/video/upload/v1669505150/media-app/Vilmos%20Misota/soundeffects/ocean-wave-pulse_abiw9i.wav",
      gain: 0.3,
      pan: 0,
      loop: true,
      repeat: false,
      random_start: false,
      buff_state: "empty",
    },
    {
      name: "crushing-wave",
      path: "https://res.cloudinary.com/vilmosmisota/video/upload/v1669505149/media-app/Vilmos%20Misota/soundeffects/crushing-wave_pm5nr8.wav",
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
      path: "https://res.cloudinary.com/vilmosmisota/video/upload/v1669505151/media-app/Vilmos%20Misota/soundeffects/underwater_xea0wd.wav",
      gain: 0.5,
      pan: 0,
      loop: true,
      repeat: false,
      random_start: false,
      buff_state: "empty",
    },
  ],
];

const clickSound =
  "https://res.cloudinary.com/vilmosmisota/video/upload/v1669505147/media-app/Vilmos%20Misota/soundeffects/camera-shutter_r6l6u9.wav";

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
    };
  }, []);

  return (
    <>
      <main
        className={` w-screen overscroll-contain overflow-hidden relative bg-zinc50`}
        style={{ height: `${windowHeight}px` }}
      >
        <audio ref={initializerAudioRef} src={clickSound}></audio>
        {!isStarted && (
          <IntroT1
            title={project.title}
            description={project.description}
            name={`${project.artists.first_name} ${project.artists.last_name}`}
            featured_img={project.featured_img}
            handleClick={handleStart}
          />
        )}

        {isStarted && isSoundtracksLoaded && (
          <SliderWrapperT1>
            <div className="absolute -z-1 top-[50%] left-0 w-full h-[calc(100%_-_120px)] -translate-y-2/4 shadow-vignette50"></div>
            <GrainCanvas />
            <SliderFrameT1 frame={project.frames[frameIndex]} />
            {project.frames.length > frameIndex + 1 && (
              <SliderFrameToPreloadT1 frame={project.frames[frameIndex + 1]} />
            )}
          </SliderWrapperT1>
        )}
        <div></div>
      </main>
      {isStarted && isSoundtracksLoaded && (
        <section className="z-30 fixed bottom-0 left-0 bg-black h-[60px] w-screen flex items-center">
          <div className="mx-auto w-full max-w-[300px] flex items-center justify-between px-2">
            <div className="absolute bottom-0 left-[50%] -translate-x-[50%] h-[25px] ">
              <canvas className="" ref={soundBarRef} width={100} height={25} />
            </div>

            <ControlBtnsT1
              handleBackward={handleBackward}
              handleForward={handleForward}
              handleMute={handleMute}
            />
          </div>
        </section>
      )}
    </>
  );
}
