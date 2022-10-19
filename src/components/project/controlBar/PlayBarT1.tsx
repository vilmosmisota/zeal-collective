import { useEffect, useState } from "react";
import { useLogger } from "../../../utils/hooks";

type PlayBarT1Props = {
  frameIndex: number;
  length: number;
  barSize: number;
};

export default function PlayBarT1({
  frameIndex,
  length,
  barSize,
}: PlayBarT1Props) {
  return (
    <div className="w-2/6  max-w-[200px] md:flex md:items-center md:justify-between relative">
      <div className="w-[90%] h-[7px] bg-black rounded-xl absolute top-[50%] left-0 -translate-y-[50%]">
        <div
          style={{ width: `${barSize}% ` }}
          className={`h-[3px]  rounded-2xl absolute bg-peach400 top-[50%] left-[1%] -translate-y-[50%]`}
        ></div>
      </div>
      <div className="w-[90%] absolute top-2 left-0  mx-auto text-center">
        <p className="text-xs text-peach400  ">
          {`${frameIndex + 1}/${length}`}
        </p>
      </div>
    </div>
  );
}
