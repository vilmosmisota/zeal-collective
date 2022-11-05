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
        frame: number[];
        state: string;
        audio: AudioBuffer;
        audioSource: AudioBufferSourceNode;
      }[]
    | null;
};

export const useAudioMix = ({ actx, buffers }: AudioMixProps) => {
  const [offset, setOffset] = useState(0);
  const [loopCount, setLoopCount] = useState(0);
  let intervalID: string | number | NodeJS.Timeout | undefined;
  const buffs = buffers;

  

  type PlayAudioProps = {
    actx: AudioContext;
    audio: {
      name: string;
      frame: number[];
      state: string;
      audio: AudioBuffer;
      audioSource: AudioBufferSourceNode;
    };
    frameIndex: number
  };

  const callInterval = (buffDuration: number) => {
    intervalID = setInterval(() => {
      setLoopCount((prev) => prev + 1);
    }, buffDuration * 1000);
  };
  const playAudio = ({ actx, audio, frameIndex }: PlayAudioProps) => {
    if (audio.frame.includes(frameIndex) === false && audio.state === "connected") return;
    if (audio.frame.includes(frameIndex) === true && audio.state === "playing") return;

    if (audio.frame.includes(frameIndex) === false && audio.state === "playing") {
        audio.audioSource.stop()
        audio.audioSource.disconnect()
        audio.state = "stopped";
        return
    };

    if (offset === 0 && loopCount === 0) {
      if (audio.state === 'stopped') {
        const audioSource = new AudioBufferSourceNode(actx, {
          buffer: audio.audio,
        });
        audioSource.connect(actx.destination);
        audioSource.loop = true;
        audioSource.start();
        setOffset(actx.currentTime);
        audio.state = "playing"; 
      } else {
        audio.audioSource.start();
        setOffset(actx.currentTime);
        audio.state = "playing";
      }
       
      return;
    }
    if (offset > 0 && loopCount === 0) {
      if (audio.state === 'stopped') {
        const audioSource = new AudioBufferSourceNode(actx, {
        buffer: audio.audio,
      });
      audioSource.connect(actx.destination);
      audioSource.loop = true;
      audioSource.start(0, actx.currentTime - offset);
      audio.state = "playing";
      } else {
        console.log(audio.state)
        audio.audioSource.start(0, actx.currentTime - offset);
        audio.state = "playing";
      }
      return;
    }
    if (offset > 0 && loopCount > 0) {
      if (audio.state === "stopped") {
        const audioSource = new AudioBufferSourceNode(actx, {
          buffer: audio.audio,
        });
        audioSource.connect(actx.destination);
        audioSource.loop = true;
        const loopedDuration = audio.audio.duration * loopCount;
        audioSource.start(0, actx.currentTime - loopedDuration - offset);
        audio.state = "playing";
      } else {
        const loopedDuration = audio.audio.duration * loopCount;
        audio.audioSource.start(0, actx.currentTime - loopedDuration - offset);
        audio.state = "playing";
      }
      return;
    }
  };

  const startLoopCount = () => {
    if (!buffs) return;
    callInterval(buffs[0].audio.duration);
  };

  const startSoundtrack = () => {
    if (!buffs) return;
    startLoopCount()
    buffs.forEach((audio) => {
      if (!actx) return;
      playAudio({ actx, audio, frameIndex:0 });
    });
  };

  const changeFrameSoundtrack = (frameIndex: number) => {
    if (!buffs) return;
    buffs.forEach((audio) => {
      if (!actx) return;
      playAudio({ actx, audio, frameIndex });
    });
  }

  return { changeFrameSoundtrack, startSoundtrack};
};
