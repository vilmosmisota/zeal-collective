import { useEffect, useState } from "react";

type AudioBuffersProps = {
  actx: AudioContext;
  sounds: {
    name: string;
    path: string;
    frame: number[];
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
      const audioSource = new AudioBufferSourceNode(actx, {
        buffer: buffer,
      });
      audioSource.connect(actx.destination);
      audioSource.loop = true;

      const gainSource = actx.createGain();
      audioSource.connect(gainSource);
      gainSource.connect(actx.destination);

      return {
        name: sound.name,
        frame: sound.frame,
        state: "connected",
        audio: buffer,
        audioSource: audioSource,
        gainNode: gainSource,
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
    frame: number[];
  }[];
};

export const useAudioBuffer = ({ actx, sounds }: UseAudioBufferProps) => {
  const [buffers, setBuffers] = useState<
    | {
        name: string;
        frame: number[];
        audio: AudioBuffer;
        audioSource: AudioBufferSourceNode;
        state: string;
        gainNode: GainNode;
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
//   frameIndex: number[];
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
