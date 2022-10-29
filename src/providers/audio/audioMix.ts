import { useEffect, useState } from "react";
import { useLogger } from "../../utils/hooks";
import { useAudioBuffer } from "./audioBuffers";

// export default function audioMix({
//   actx,
//   buffers,
// }: {
//   actx: AudioContext;
//   buffers: {
//     name: string;
//     isActive: boolean;
//     buffer: AudioBuffer;
//   }[];
// }) {
//   let currentBeatInBar = 0;
//   const beatsPerBar = 8;
//   const tempo = 95;
//   const lookahead = 25; // How frequently to call scheduling function (in milliseconds)
//   const scheduleAheadTime = 0.1; // How far ahead to schedule audio (sec)
//   let nextNoteTime = 0.0; // when the next note is due
//   let isRunning = false;
//   let intervalID: string | number | NodeJS.Timeout | undefined;
//   let buffersToPlay = buffers;
//   let frameIndex = 0;

//   console.log(buffersToPlay);

//   const nextNote = () => {
//     // Advance current note and time by a quarter note (crotchet if you're posh)
//     const secondsPerBeat = 60.0 / tempo; // Notice this picks up the CURRENT tempo value to calculate beat length.
//     nextNoteTime += secondsPerBeat; // Add beat length to last beat time
//     console.log("secondsperbeat", secondsPerBeat);
//     console.log("nextnotetime", nextNoteTime);
//     currentBeatInBar++; // Advance the beat number, wrap to zero
//     if (currentBeatInBar == beatsPerBar) {
//       currentBeatInBar = 0;
//     }
//   };

//   const playSound = (
//     actx: AudioContext,
//     audioBuffer: AudioBuffer,
//     time: number
//   ) => {
//     const soundSource = new AudioBufferSourceNode(actx, {
//       buffer: audioBuffer,
//     });
//     soundSource.connect(actx.destination);
//     soundSource.start(time);
//     return soundSource;
//   };

//   let offset = 0;

//   const scheduleNote = (
//     beatNumber: number,
//     time: number
//     // buffersToPlay: {
//     //   name: string;
//     //   isActive: boolean;
//     //   buffer: AudioBuffer;
//     // }[]
//   ) => {
//     buffersToPlay.forEach((item) => {
//       if (beatNumber === 0 && offset === 0 && item.isActive) {
//         const soundSource = new AudioBufferSourceNode(actx, {
//           buffer: item.buffer,
//         });
//         soundSource.connect(actx.destination);
//         soundSource.start();
//         offset = actx.currentTime;
//         return;
//       }
//       if (beatNumber !== 0 && offset !== 0 && item.isActive) {
//         const soundSource = new AudioBufferSourceNode(actx, {
//           buffer: item.buffer,
//         });
//         soundSource.connect(actx.destination);
//         soundSource.start(0, actx.currentTime - offset);
//         return;
//       }
//     });
//   };

//   const schedulerOld = () => {
//     // while there are notes that will need to play before the next interval, schedule them and advance the pointer.
//     while (nextNoteTime < actx.currentTime + scheduleAheadTime) {
//       scheduleNote(currentBeatInBar, nextNoteTime);
//       nextNote();
//     }
//   };

//   let timerID;
//   function scheduler() {
//     // While there are notes that will need to play before the next interval,
//     // schedule them and advance the pointer.
//     while (nextNoteTime < actx.currentTime + scheduleAheadTime) {
//       scheduleNote(currentBeatInBar, nextNoteTime);
//       nextNote();
//     }
//     timerID = setTimeout(scheduler, lookahead);
//   }

//   const start = () => {
//     if (isRunning) return;

//     isRunning = true;

//     currentBeatInBar = 0;
//     nextNoteTime = actx.currentTime;

//     // intervalID = setInterval(() => scheduler(), lookahead);

//     scheduler();
//   };

//   const stop = () => {
//     isRunning = false;

//     clearInterval(timerID);
//   };

//   const startStop = () => {
//     if (isRunning) {
//       stop();
//     } else {
//       start();
//     }
//   };

//   const updateBuffers = () => {
//     buffersToPlay[1].isActive = true;
//   };

//   return { startStop, updateBuffers };
// }

// type UseAudioMixProps = {
//   actx: AudioContext;
//   audio: {
//     name: string;
//     isActive: boolean;
//     audio: AudioBuffer;
//   };
// };

// export const useAudioMix = ({ actx, buffers }: UseAudioMixProps) => {
//   const beatsPerBar = 8;
//   const tempo = 95;
//   const lookahead = 25;
//   const scheduleAheadTime = 0.1;
//   const secondsPerBeat = 60.0 / tempo;
//   const [isRunning, setIsRunning] = useState(false);
//   const [intervalID, setIntervalID] = useState(null);
//   const [currentBeatInBar, setCurrentBeatInBar] = useState(0);
//   const [nextNoteTime, setNextNoteTime] = useState(0.0);

//   // How far ahead to schedule audio (sec)

//   const nextNote = (secondsPerBeat: number) => {
//     setNextNoteTime(nextNoteTime + secondsPerBeat);

//     if (currentBeatInBar === beatsPerBar) {
//       setCurrentBeatInBar(0);
//       return;
//     }
//     setCurrentBeatInBar((prev) => prev + 1);
//   };

//   const scheduleNote = (
//     beatNumber: number,
//     time: number,
//     buffers: {
//       name: string;
//       isActive: boolean;
//       buffer: AudioBuffer;
//     }[]
//   ) => {
//     buffers.forEach((item) => {
//       if (beatNumber === 0 && item.isActive) {
//         playSound(actx, item.buffer, time);
//       }
//     });
//   };

//   // const playSound = (
//   //   actx: AudioContext,
//   //   audioBuffer: AudioBuffer,
//   //   time: number
//   // ) => {
//   //   const soundSource = new AudioBufferSourceNode(actx, {
//   //     buffer: audioBuffer,
//   //   });
//   //   soundSource.connect(actx.destination);
//   //   soundSource.start(time);
//   //   return soundSource;
//   // };
// };

type AudioMixProps = {
  actx: AudioContext | null;
  buffers:
    | {
        name: string;
        isActive: boolean;
        isRunning: boolean;
        audio: AudioBuffer;
      }[]
    | null;
};

export const useAudioMix = ({ actx, buffers }: AudioMixProps) => {
  const [offset, setOffset] = useState(0);
  const [loopCount, setLoopCount] = useState(0);
  let intervalID: string | number | NodeJS.Timeout | undefined;
  const buffs = buffers;

  useLogger(loopCount);

  type PlayAudioProps = {
    actx: AudioContext;
    audio: {
      name: string;
      isActive: boolean;
      isRunning: boolean;
      audio: AudioBuffer;
    };
  };

  const callInterval = (buffDuration: number) => {
    intervalID = setInterval(() => {
      setLoopCount((prev) => prev + 1);
    }, buffDuration * 1000);
  };
  const playAudio = ({ actx, audio }: PlayAudioProps) => {
    if (!audio.isActive || audio.isRunning) return;
    const audioSource = new AudioBufferSourceNode(actx, {
      buffer: audio.audio,
    });
    audioSource.connect(actx.destination);
    audioSource.loop = true;

    // audioSource.start(0, actx.currentTime - offset);
    // audio.isRunning = true;
    console.log("loopend", audioSource.loopEnd);
    console.log(offset);

    if (offset === 0) {
      audioSource.start();
      setOffset(actx.currentTime);
      audio.isRunning = true;
      return;
    }
    if (loopCount === 0) {
      audioSource.start(0, actx.currentTime - offset);
      console.log("loop 0 but offset is gone");
      audio.isRunning = true;
      return;
    }
    if (loopCount > 0) {
      const loopedDuration = audio.audio.duration * loopCount;
      audioSource.start(0, loopedDuration - offset);
      audio.isRunning = true;
      console.log("looped duration", loopedDuration);
      console.log("loop passed 0");
      return;
    }

    // else {
    //   audioSource.start(0, actx.currentTime - audio.audio.duration - offset);
    //   const newOff = actx.currentTime - offset;
    //   const audioLength = audio.audio.duration;
    //   const afterLoop = actx.currentTime - audio.audio.duration - offset;
    //   console.log("newOffset", newOff);
    //   console.log("audioLength", audioLength);
    //   console.log("afterLopp", afterLoop);

    //   audio.isRunning = true;
    // }
  };

  const startLoopCount = () => {
    if (!buffs) return;
    callInterval(buffs[0].audio.duration);
  };

  const startMix = () => {
    if (!buffs) return;
    buffs.forEach((audio) => {
      if (!actx) return;
      playAudio({ actx, audio });
    });
  };

  const updateBuffers = (num: number) => {
    if (!buffs) return;
    buffs[num].isActive = true;
  };

  return { updateBuffers, startMix, startLoopCount };
};
