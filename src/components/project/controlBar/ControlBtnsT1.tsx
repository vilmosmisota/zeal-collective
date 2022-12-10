import { BackwardBtn } from "../../buttons/BackwardBtn";
import { ForwardBtn } from "../../buttons/ForwardBtn";

type ControlBtnsT1Props = {
  handleBackward: () => void;
  handleForward: () => void;
  handleMute: () => void;
};

export default function ControlBtnsT1({
  handleBackward,
  handleForward,
  handleMute,
}: ControlBtnsT1Props) {
  return (
    <div className=" w-full mx-3 relative">
      {/* <button
        onClick={handleMute}
        className="text-peach400 text-center mx-auto w-4 block"
      >
        Mute
      </button> */}
      <BackwardBtn handleClick={handleBackward} />
      <ForwardBtn handleClick={handleForward} />
    </div>
  );
}
