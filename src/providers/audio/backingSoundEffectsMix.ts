import { useState } from "react";

type TSounds = {
  name: string;
  path: string;
  gain: number;
  pan: number;
  loop: boolean;
  repeat: boolean;
  random_start: boolean;
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

  const preLoadEffect = async (effect: TSounds[], actx: AudioContext) => {
    const effBuffer = await loadBuffers(actx, effect);
    const preLoadedBuffer = effBuffer.map((sound) => {
      const { audioSource, panNode, gainNode } = setUpAudioNodes(
        actx,
        sound.buffer
      );
      const b = {
        ...sound,
        bufferSource: audioSource,
        panNode: panNode,
        gainNode: gainNode,
        isPlaying: true,
      };

      return b;
    });
    setBuffers((prev) => [...prev, preLoadedBuffer]);
  };

  const startSoundEffects = async (effects: TSounds[], actx: AudioContext) => {
    const loadedBuffers = await loadBuffers(actx, effects);

    const effectBuffers = loadedBuffers.map((sound) => {
      const { audioSource, panNode, gainNode } = setUpAudioNodes(
        actx,
        sound.buffer
      );

      if (sound.loop) {
        audioSource.loop = true;
        fadeInSound(gainNode, audioSource, actx, sound.gain, 3);
        const b = {
          ...sound,
          bufferSource: audioSource,
          panNode: panNode,
          gainNode: gainNode,
          isPlaying: true,
        };
        return b;
      }
      fadeInSound(gainNode, audioSource, actx, sound.gain, 3);

      const b = {
        ...sound,
        bufferSource: audioSource,
        panNode: panNode,
        gainNode: gainNode,
        isPlaying: true,
      };
      return b;
    });

    setActx(actx);
    setBuffers((prev) => [...prev, effectBuffers]);
  };

  const playSound = (frameIndex: number) => {
    if (!actx) return;
    if (buffers.length < frameIndex + 1) return;
    const buffersToPlay = [...buffers];
    const updatedBuffers = buffersToPlay.map((sounds, i) => {
      if (i !== frameIndex) return sounds;
      const updatedBuffer = sounds.map((sound) => {
        if (sound.isCleared && !sound.isPlaying) {
          console.log("new buffer to be creater");
          const { audioSource, panNode, gainNode } = setUpAudioNodes(
            actx,
            sound.buffer
          );
          if (sound.loop) {
            audioSource.loop = true;
            fadeInSound(gainNode, audioSource, actx, sound.gain, 3);
            const b = {
              ...sound,
              bufferSource: audioSource,
              panNode: panNode,
              gainNode: gainNode,
              isPlaying: true,
            };
            return b;
          }
          fadeInSound(gainNode, audioSource, actx, sound.gain, 3);

          const b = {
            ...sound,
            bufferSource: audioSource,
            panNode: panNode,
            gainNode: gainNode,
            isPlaying: true,
          };
          return b;
        }
        if (!sound.bufferSource || !sound.gainNode || !sound.panNode)
          return sound;
        if (sound.loop) {
          sound.bufferSource.loop = true;
          fadeInSound(sound.gainNode, sound.bufferSource, actx, sound.gain, 3);
          const b = {
            ...sound,
            isPlaying: true,
          };
          return b;
        }
        fadeInSound(sound.gainNode, sound.bufferSource, actx, sound.gain, 3);
        const b = {
          ...sound,
          isPlaying: true,
        };
        return b;
      });
      return updatedBuffer;
    });
    setBuffers(updatedBuffers);
  };

  const stopSounds = (frameIndex: number) => {
    if (!actx) return;
    const buffersToStop = [...buffers];
    const updatedBuffers = buffersToStop.map((sounds, i) => {
      if (i !== frameIndex) return sounds;
      const updatedBuffer = sounds.map((sound) => {
        if (!sound.bufferSource || !sound.gainNode || !sound.panNode)
          return sound;

        if (!sound.isPlaying) return sound;
        fadeOutSound(sound.gainNode, sound.bufferSource, actx, sound.gain, 3);
        const b = {
          ...sound,
          isPlaying: false,
          isCleared: true,
        };

        return b;
      });

      return updatedBuffer;
    });
    setBuffers(updatedBuffers);
  };

  return { startSoundEffects, stopSounds, preLoadEffect, playSound };
}

const setUpAudioNodes = (acontext: AudioContext, buffer: AudioBuffer) => {
  const audioSource = acontext.createBufferSource();
  audioSource.buffer = buffer;
  const gainNode = acontext.createGain();
  const panNode = acontext.createStereoPanner();
  audioSource.connect(gainNode).connect(panNode).connect(acontext.destination);

  return { audioSource, gainNode, panNode };
};

const fadeInSound = (
  gainNode: GainNode,
  audioSource: AudioBufferSourceNode,
  acontext: AudioContext,
  volume: number,
  delay: number
) => {
  console.log(volume);
  gainNode.gain.setValueAtTime(0, acontext.currentTime);
  gainNode.gain.linearRampToValueAtTime(volume, acontext.currentTime + delay);
  audioSource.start();
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
