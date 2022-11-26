import { useState } from "react";

export const useUIEffectMix = () => {
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
    audioSource.playbackRate.value = 1;
    audioSource.start();
  };

  return { loadClickBuffer, playClick };
};
