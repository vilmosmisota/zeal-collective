// const sounds = [
//   {
//     name: "beat",
//     path: "https://kyvqisljtzamvrttkpad.supabase.co/storage/v1/object/sign/soundtracks/beat_1.wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJzb3VuZHRyYWNrcy9iZWF0XzEud2F2IiwiaWF0IjoxNjY2Mjk5NTgyLCJleHAiOjE5ODE2NTk1ODJ9.8pmjqjpn-xZyaZZyc2MZ0d1c6xDbGm4tH95TJX5pf78&t=2022-10-20T20%3A59%3A41.272Z",
//   },
//   {
//     name: "synth",
//     path: "https://kyvqisljtzamvrttkpad.supabase.co/storage/v1/object/sign/soundtracks/lead%20synth_1.wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJzb3VuZHRyYWNrcy9sZWFkIHN5bnRoXzEud2F2IiwiaWF0IjoxNjY2MzA3MDcxLCJleHAiOjE5ODE2NjcwNzF9.0roCqmexR4HiPWd-0dNZr56XqUl5pWumGtL4LzDpuow&t=2022-10-20T23%3A04%3A29.974Z",
//   },
// ];

import { useEffect, useState } from "react";

type AudioBuffersProps = {
  actx: AudioContext;
  sounds: {
    name: string;
    path: string;
    isActive: boolean;
  }[];
};

export async function loadAudioBuffers({ actx, sounds }: AudioBuffersProps) {
  const getFile = async (filePath: string) => {
    const response = await fetch(filePath);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await actx.decodeAudioData(arrayBuffer);
    return audioBuffer;
  };

  const audioBuffers = Promise.all(
    sounds.map(async (sound) => {
      const buffer = await getFile(sound.path);
      // const bufferSource = actx.createBufferSource();
      // bufferSource.buffer = buffer;
      // bufferSource.connect(actx.destination);

      return {
        name: sound.name,
        isActive: sound.isActive,
        isRunning: false,
        audio: buffer,
      };
    })
  );

  return audioBuffers;
}

type UseAudioBufferProps = {
  actx: AudioContext | null;
  sounds: {
    name: string;
    path: string;
    isActive: boolean;
  }[];
};

export const useAudioBuffer = ({ actx, sounds }: UseAudioBufferProps) => {
  const [buffers, setBuffers] = useState<
    | {
        name: string;
        isActive: boolean;
        audio: AudioBuffer;
        isRunning: boolean;
      }[]
    | null
  >(null);

  useEffect(() => {
    if (!actx) return;

    const loadBuffers = async () => {
      const bs = await loadAudioBuffers({ actx, sounds });
      setBuffers(bs);
    };
    loadBuffers().catch((err) => console.warn(err));
  }, [sounds, actx]);
  return buffers;
};

// export const useBuffersToPlay = ({
//   buffers,
//   frameIndex,
// }: {
//   buffers: AudioBuffer[] | null;
//   frameIndex: number;
// }) => {
//   const [buffersToPlay, setBuffersToPlay] = useState<AudioBuffer[] | null>(
//     null
//   );

//   useEffect(() => {
//     if (!buffers) return;
//     const btp = buffers.slice(0, frameIndex + 1);
//     setBuffersToPlay(btp);
//   }, [buffersToPlay, buffers, frameIndex]);
//   return buffersToPlay;
// };
