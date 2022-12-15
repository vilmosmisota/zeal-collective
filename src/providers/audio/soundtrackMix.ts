import { useEffect, useState } from "react";
import { useLogger } from "../../utils/hooks";

type TSoundtracks = {
  name: string;
  path: string;
  gain: number;
  frame: number[];
};

type TAudioNode = {
  buffer: AudioBuffer;
  bufferSource: AudioBufferSourceNode | null;
  gainNode: GainNode | null;
  analyzerNode: AnalyserNode | null;
  isPlaying: boolean;
};

type TSoundtrackBuffers = TSoundtracks & TAudioNode;

export async function loadSoundtrackBuffers(
  actx: AudioContext,
  tracks: TSoundtracks[]
) {
  const getFile = async (filePath: string) => {
    const response = await fetch(filePath);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await actx.decodeAudioData(arrayBuffer);
    return audioBuffer;
  };

  const audioBuffers = Promise.all(
    tracks.map(async (track) => {
      const buffer = await getFile(track.path);
      return {
        ...track,
        buffer,
        isPlaying: false,
        bufferSource: null,
        gainNode: null,
      };
    })
  );

  return audioBuffers;
}

export const useSoundtrackMix = () => {
  const [isSoundtracksLoaded, setBuffersLoaded] = useState(false);
  const [buffers, setBuffers] = useState<null | TSoundtrackBuffers[]>(null);
  const [actx, setActx] = useState<null | AudioContext>(null);
  const [masterGain, setMasterGain] = useState<null | GainNode>(null);

  const startSoundtracks = async (
    actx: AudioContext,
    mGain: GainNode,
    analyzerN: AnalyserNode,
    tracks: TSoundtracks[]
  ) => {
    const loadedBuffers = await loadSoundtrackBuffers(actx, tracks);

    const trackBuffers = loadedBuffers.map((track) => {
      const { audioSource, gainNode, analyzerNode } = setUpAudioNodes(
        actx,
        track.buffer,
        mGain,
        analyzerN
      );
      audioSource.loop = true;
      gainNode.gain.value = 0;

      if (track.frame.includes(0) === false) {
        audioSource.start();
        const b = {
          ...track,
          bufferSource: audioSource,
          analyzerNode: analyzerN,
          gainNode: gainNode,
        };
        return b;
      }

      fadeInSound(gainNode, audioSource, actx, track.gain, 3, 2);
      const b = {
        ...track,
        bufferSource: audioSource,
        analyzerNode: analyzerN,
        gainNode: gainNode,
        isPlaying: true,
      };
      return b;
    });
    setBuffers(trackBuffers);
    setBuffersLoaded(true);
    setActx(actx);
    setMasterGain(mGain);
  };

  const playSoundtrack = (frameIndex: number) => {
    if (!actx || !masterGain || !buffers) return;
    const buffersToPlay = [...buffers];
    const updatedBuffers = buffersToPlay.map((buffer) => {
      if (
        buffer.frame.includes(frameIndex) === false &&
        buffer.isPlaying === false &&
        buffer.gainNode
      ) {
        return buffer;
      }

      if (
        buffer.frame.includes(frameIndex) === true &&
        buffer.isPlaying === true
      ) {
        return buffer;
      }

      if (
        buffer.frame.includes(frameIndex) === false &&
        buffer.isPlaying === true &&
        buffer.gainNode
      ) {
        buffer.gainNode.gain.setValueAtTime(buffer.gain, actx.currentTime);
        buffer.gainNode.gain.linearRampToValueAtTime(0, actx.currentTime + 3);
        const b = {
          ...buffer,
          isPlaying: false,
        };

        return b;
      }

      if (
        buffer.frame.includes(frameIndex) === true &&
        buffer.isPlaying === false &&
        buffer.gainNode
      ) {
        buffer.gainNode.gain.setValueAtTime(0, actx.currentTime);
        buffer.gainNode.gain.linearRampToValueAtTime(
          buffer.gain,
          actx.currentTime + 3
        );

        const b = {
          ...buffer,
          isPlaying: true,
        };
        return b;
      }

      return buffer;
    });
    setBuffers(updatedBuffers);
  };

  return { startSoundtracks, isSoundtracksLoaded, playSoundtrack };
};

const setUpAudioNodes = (
  acontext: AudioContext,
  buffer: AudioBuffer,
  masterGain: GainNode,
  analyzerNode: AnalyserNode
) => {
  const audioSource = acontext.createBufferSource();
  audioSource.buffer = buffer;
  const gainNode = acontext.createGain();

  audioSource
    .connect(gainNode)
    .connect(masterGain)
    .connect(analyzerNode)
    .connect(acontext.destination);

  return { audioSource, gainNode, analyzerNode };
};

const fadeInSound = (
  gainNode: GainNode,
  audioSource: AudioBufferSourceNode,
  acontext: AudioContext,
  volume: number,
  delay: number,
  start: number
) => {
  gainNode.gain.setValueAtTime(0, acontext.currentTime);
  gainNode.gain.linearRampToValueAtTime(
    volume,
    acontext.currentTime + delay + start
  );
  audioSource.start(start);
};
