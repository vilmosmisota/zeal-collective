import { BackwardBtn } from "../../buttons/BackwardBtn";
import DropdownBtn from "../../buttons/DropdownBtn";
import { ForwardBtn } from "../../buttons/ForwardBtn";

type ControlBtnsT1Props = {
  handleBackward: () => void;
  handleForward: () => void;
  frameIndex: number;
  frameLength: number;
};

export default function ControlBtnsT1({
  handleBackward,
  handleForward,
  frameIndex,
  frameLength,
}: ControlBtnsT1Props) {
  const isHidePrev = frameIndex === 0;
  const isHideNext = frameIndex === frameLength;

  return (
    <div className=" w-full mx-3 relative h-full ">
      <BackwardBtn handleClick={handleBackward} isHide={isHidePrev} />
      <ForwardBtn handleClick={handleForward} isHide={isHideNext} />
    </div>
  );
}
