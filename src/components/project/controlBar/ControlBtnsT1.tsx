import { BackwardBtn } from "../../buttons/BackwardBtn";
import { ForwardBtn } from "../../buttons/ForwardBtn";
import { PauseBtn } from "../../buttons/PauseBtn";
import { PlayBtn } from "../../buttons/PlayBtn";

type ControlBtnsT1Props = {
  handleBackward: () => void;
  handlePausePlay: () => void;
  handleForward: () => void;
  isPausePlay: boolean;
};

export default function ControlBtnsT1({
  handleBackward,
  handlePausePlay,
  handleForward,
  isPausePlay,
}: ControlBtnsT1Props) {
  return (
    <div className=" w-2/6 flex max-w-[200px] mx-3 justify-center items-center">
      <BackwardBtn handleClick={handleBackward} />
      {!isPausePlay ? (
        <PlayBtn handleClick={handlePausePlay} />
      ) : (
        <PauseBtn handleClick={handlePausePlay} />
      )}

      <ForwardBtn handleClick={handleForward} />
    </div>
  );
}
