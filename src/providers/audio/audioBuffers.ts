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
        isPlaying: false,
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
        isPlaying: boolean;
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

type AudioBufferProps = {
  actx: AudioContext;
  sound: string;
};

export const useClickBuffer = () => {
  const [clickAudioNode, setClickAudioNode] = useState<null | {
    audioBuffer: AudioBuffer;
    gainSource: GainNode;
  }>(null);
  const loadBuffer = async (actx: AudioContext, filePath: string) => {
    const response = await fetch(filePath);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await actx.decodeAudioData(arrayBuffer);
    return audioBuffer;
  };

  const loadClickBuffer = async (actx: AudioContext, filePath: string) => {
    const audioBuffer = await loadBuffer(actx, filePath);

    const gainSource = actx.createGain();
    gainSource.connect(actx.destination);

    const aNode = {
      audioBuffer,
      gainSource,
    };
    setClickAudioNode(aNode);
  };
  const playClick = (actx: AudioContext) => {
    if (!clickAudioNode) return;
    const audioSource = new AudioBufferSourceNode(actx, {
      buffer: clickAudioNode.audioBuffer,
    });
    audioSource.connect(actx.destination);
    audioSource.connect(clickAudioNode.gainSource);
    clickAudioNode.gainSource.gain.value = -0.7;
    audioSource.start();
  };

  return { loadClickBuffer, playClick };
};

// -1, -0.9, -0.8, -0.7, -0.6, -0.5, -0.4, -0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1

// 0-20
// master: 15

// soundtrack: 70%
// soundeffect: 100%
// clicksound: 60%
