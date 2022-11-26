import { BackwardBtn } from "../../buttons/BackwardBtn";
import { ForwardBtn } from "../../buttons/ForwardBtn";

type ControlBtnsT1Props = {
  handleBackward: () => void;
  handleForward: () => void;
};

export default function ControlBtnsT1({
  handleBackward,
  handleForward,
}: ControlBtnsT1Props) {
  return (
    <div className=" w-full mx-3 relative">
      <BackwardBtn handleClick={handleBackward} />
      <ForwardBtn handleClick={handleForward} />
    </div>
  );
}
