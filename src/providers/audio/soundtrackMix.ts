import { useEffect, useState } from "react";

type TLoadBuffers = {
  mactx: AudioContext;
  sounds: {
    name: string;
    path: string;
    frame: number[];
  }[];
};
type TBuffers = {
  name: string;
  frame: number[];
  isPlaying: boolean;
  audio: AudioBuffer;
  audioSource: AudioBufferSourceNode;
  gainNode: GainNode;
};

export async function loadSoundtrackBuffers({ mactx, sounds }: TLoadBuffers) {
  const getFile = async (filePath: string) => {
    const response = await fetch(filePath);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await mactx.decodeAudioData(arrayBuffer);
    return audioBuffer;
  };

  const audioBuffers = Promise.all(
    sounds.map(async (sound) => {
      const buffer = await getFile(sound.path);
      const audioSource = new AudioBufferSourceNode(mactx, {
        buffer: buffer,
      });
      audioSource.connect(mactx.destination);
      audioSource.loop = true;

      const gainSource = mactx.createGain();
      audioSource.connect(gainSource);
      gainSource.connect(mactx.destination);

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

type TStartAudio = {
  audio: TBuffers;
  frameIndex: number;
};

export const useSoundtrackBuffer = () => {
  const [isLoading, setLoading] = useState(false);
  const [isBuffersLoaded, setBuffersLoaded] = useState(false);
  const [buffers, setBuffers] = useState<null | TBuffers[]>(null);
  const [actx, setActx] = useState<null | AudioContext>(null);

  const loadBuffers = async ({ mactx, sounds }: TLoadBuffers) => {
    setLoading(true);
    const bs = await loadSoundtrackBuffers({ mactx, sounds });
    setBuffers(bs);
    setLoading(false);
    setBuffersLoaded(true);
    setActx(mactx);
  };

  return { buffers, actx, loadBuffers, isBuffersLoaded };
};

export const useSoundtrackMix = () => {
  const {
    actx,
    buffers,
    isBuffersLoaded: isSoundtracksLoaded,
    loadBuffers: startSoundtracks,
  } = useSoundtrackBuffer();

  useEffect(() => {
    if (!isSoundtracksLoaded || !buffers || !actx) return;

    const startAudio = ({ audio, frameIndex }: TStartAudio) => {
      audio.gainNode.gain.setValueAtTime(-1, actx.currentTime);

      if (audio.frame.includes(frameIndex) === false) {
        audio.audioSource.start();
        return;
      }

      audio.gainNode.gain.linearRampToValueAtTime(1, actx.currentTime + 3);
      audio.audioSource.start();
      audio.isPlaying = true;
    };

    buffers.forEach((audio) => {
      if (!actx) return;
      startAudio({ audio, frameIndex: 0 });
    });
  }, [actx, buffers, isSoundtracksLoaded]);

  const handleFrameChange = ({ audio, frameIndex }: TStartAudio) => {
    if (!actx) return;
    if (
      audio.frame.includes(frameIndex) === false &&
      audio.isPlaying === false
    ) {
      return;
    }

    if (audio.frame.includes(frameIndex) === true && audio.isPlaying === true) {
      return;
    }

    if (
      audio.frame.includes(frameIndex) === false &&
      audio.isPlaying === true
    ) {
      audio.gainNode.gain.setValueAtTime(1, actx.currentTime);
      audio.gainNode.gain.linearRampToValueAtTime(-1, actx.currentTime + 3);
      audio.isPlaying = false;
      return;
    }

    if (
      audio.frame.includes(frameIndex) === true &&
      audio.isPlaying === false
    ) {
      audio.gainNode.gain.setValueAtTime(-1, actx.currentTime);
      audio.gainNode.gain.linearRampToValueAtTime(1, actx.currentTime + 3);
      audio.isPlaying = true;
      return;
    }
  };

  const changeFrameSoundtrack = (frameIndex: number) => {
    if (!buffers) return;
    buffers.forEach((audio) => {
      if (!actx) return;
      handleFrameChange({ audio, frameIndex });
    });
  };

  // return { changeFrameSoundtrack, startSoundtracks };

  return { startSoundtracks, isSoundtracksLoaded, changeFrameSoundtrack };
};
