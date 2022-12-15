import { useState } from "react";
import { useLogger } from "../../utils/hooks";

export type TSounds = {
  name: string;
  path: string;
  gain: number;
  pan: number;
  loop: boolean;
  repeat: boolean;
  random_start: boolean;
  buff_state: "empty" | "loaded" | "ready";
};

type TAudioNode = {
  buffer: AudioBuffer;
  bufferSource: AudioBufferSourceNode | null;
  panNode: StereoPannerNode | null;
  gainNode: GainNode | null;
  isPlaying: boolean;
  isCleared: boolean;
};

type TBuffers = TSounds & TAudioNode;

export async function loadBuffers(mactx: AudioContext, effects: TSounds[]) {
  const getFile = async (filePath: string) => {
    const response = await fetch(filePath);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await mactx.decodeAudioData(arrayBuffer);
    return audioBuffer;
  };

  const audioBuffers = Promise.all(
    effects.map(async (effect) => {
      const buffer = await getFile(effect.path);
      return {
        ...effect,
        buffer,
        bufferSource: null,
        panNode: null,
        gainNode: null,
        isPlaying: false,
        isCleared: false,
      };
    })
  );

  return audioBuffers;
}

export function useSoundEffectMix() {
  const [buffers, setBuffers] = useState<Array<TBuffers[]>>([]);
  const [actx, setActx] = useState<null | AudioContext>(null);
  const [masterGain, setMasterGain] = useState<null | GainNode>(null);
  const [loadedFrames, setLoadedFrames] = useState<number[]>([]);

  const preLoadEffect = async (
    effect: TSounds[],
    actx: AudioContext,
    mGain: GainNode,
    frameToPreload: number
  ) => {
    if (loadedFrames.includes(frameToPreload)) return;

    const effBuffer = await loadBuffers(actx, effect);
    const preLoadedBuffer = effBuffer.map((sound) => {
      const { audioSource, panNode, gainNode } = setUpAudioNodes(
        actx,
        sound.buffer,
        mGain
      );
      const b = {
        ...sound,
        bufferSource: audioSource,
        panNode: panNode,
        gainNode: gainNode,
        isPlaying: false,
      };
      b.buff_state = "loaded";
      return b;
    });
    setBuffers((prev) => [...prev, preLoadedBuffer]);
    setLoadedFrames((prev) => [...prev, frameToPreload]);
  };

  const startSoundEffects = async (
    effects: TSounds[],
    actx: AudioContext,
    mGain: GainNode
  ) => {
    const loadedBuffers = await loadBuffers(actx, effects);

    const effectBuffers = loadedBuffers.map((sound) => {
      const { audioSource, panNode, gainNode } = setUpAudioNodes(
        actx,
        sound.buffer,
        mGain
      );

      if (sound.loop) {
        audioSource.loop = true;
        fadeInSound(
          gainNode,
          panNode,
          audioSource,
          actx,
          sound.gain,
          sound.pan,
          3,
          1
        );
        const b = {
          ...sound,
          bufferSource: audioSource,
          panNode: panNode,
          gainNode: gainNode,
          isPlaying: true,
        };
        b.buff_state = "ready";
        return b;
      }
      fadeInSound(
        gainNode,
        panNode,
        audioSource,
        actx,
        sound.gain,
        sound.pan,
        3,
        1
      );

      const b = {
        ...sound,
        bufferSource: audioSource,
        panNode: panNode,
        gainNode: gainNode,
        isPlaying: true,
      };
      b.buff_state = "ready";
      return b;
    });

    setActx(actx);
    setMasterGain(mGain);
    setBuffers((prev) => [...prev, effectBuffers]);
  };

  const playSound = (frameIndex: number) => {
    if (!actx || !masterGain || buffers.length < frameIndex + 1) return;
    const buffersToPlay = [...buffers];

    const updatedBuffers = buffersToPlay.map((sounds, i) => {
      if (i !== frameIndex) {
        const updatedBuffer = sounds.map((sound) => {
          if (
            !sound.bufferSource ||
            !sound.gainNode ||
            !sound.panNode ||
            sound.buff_state !== "ready"
          ) {
            const b = {
              ...sound,
            };
            return b;
          }

          fadeOutSound(sound.gainNode, sound.bufferSource, actx, sound.gain, 3);
          const b = {
            ...sound,
            isPlaying: false,
            isCleared: true,
          };
          b.buff_state = "loaded";
          return b;
        });
        return updatedBuffer;
      }

      const updatedBuffer = sounds.map((sound) => {
        const { audioSource, panNode, gainNode } = setUpAudioNodes(
          actx,
          sound.buffer,
          masterGain
        );

        if (sound.loop) {
          audioSource.loop = true;
          fadeInSound(
            gainNode,
            panNode,
            audioSource,
            actx,
            sound.gain,
            sound.pan,
            3,
            0
          );
          const b = {
            ...sound,
            bufferSource: audioSource,
            panNode: panNode,
            gainNode: gainNode,
            isPlaying: true,
            isCleared: false,
          };
          b.buff_state = "ready";
          return b;
        }

        fadeInSound(
          gainNode,
          panNode,
          audioSource,
          actx,
          sound.gain,
          sound.pan,
          3,
          0
        );

        const b = {
          ...sound,
          bufferSource: audioSource,
          panNode: panNode,
          gainNode: gainNode,
          isPlaying: true,
          isCleared: false,
        };
        b.buff_state = "ready";
        return b;
      });

      return updatedBuffer;
    });

    setBuffers(updatedBuffers);
  };

  return { startSoundEffects, preLoadEffect, playSound };
}

const setUpAudioNodes = (
  acontext: AudioContext,
  buffer: AudioBuffer,
  masterGain: GainNode
) => {
  const audioSource = acontext.createBufferSource();
  audioSource.buffer = buffer;
  const gainNode = acontext.createGain();
  const panNode = acontext.createStereoPanner();

  audioSource
    .connect(gainNode)
    .connect(panNode)
    .connect(masterGain)
    .connect(acontext.destination);

  return { audioSource, gainNode, panNode };
};

const fadeInSound = (
  gainNode: GainNode,
  panNode: StereoPannerNode,
  audioSource: AudioBufferSourceNode,
  acontext: AudioContext,
  volume: number,
  pan: number,
  delay: number,
  start: number
) => {
  panNode.pan.setValueAtTime(pan, acontext.currentTime);
  gainNode.gain.setValueAtTime(0, acontext.currentTime);
  gainNode.gain.linearRampToValueAtTime(
    volume,
    acontext.currentTime + delay + start
  );
  audioSource.start(start);
};

const fadeOutSound = (
  gainNode: GainNode,
  audioSource: AudioBufferSourceNode,
  acontext: AudioContext,
  volume: number,
  delay: number
) => {
  gainNode.gain.setValueAtTime(volume, acontext.currentTime);
  gainNode.gain.linearRampToValueAtTime(0, acontext.currentTime + delay);
  audioSource.stop(delay);
};
