import { motion } from "framer-motion";

type ForwardBtnProps = {
  handleClick: () => void;
  isHide: boolean;
};
export const ForwardBtn = ({ handleClick, isHide }: ForwardBtnProps) => {
  return (
    <button
      onClick={handleClick}
      className={` ${
        isHide
          ? "opacity-25 pointer-events-none"
          : "opacity-100 pointer-events-auto"
      } block absolute top-[50%] right-[0] -translate-y-[50%]`}
    >
      <motion.svg
        viewBox="0 0 30 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        stroke="currentColor"
        className="w-5 h-5 text-peach400 "
        initial={{ fill: "none" }}
        whileTap={{ fill: "#EDDBD0" }}
      >
        <path
          d="M2.43599 1.95182L2.43603 1.95185L12.125 10.0251V12V13.975L2.43678 22.0475C2.17531 22.265 1.81018 22.313 1.50276 22.1689C1.19458 22.0243 1 21.7168 1 21.375V2.625C1 2.28743 1.19688 1.9759 1.50586 1.82969C1.80778 1.68681 2.17071 1.73075 2.43599 1.95182ZM16 17.625V12V4.5V2.625C16 2.28743 16.1969 1.9759 16.5059 1.82969C16.8078 1.68681 17.1707 1.73075 17.436 1.95182L28.685 11.326C28.685 11.326 28.6851 11.3261 28.6852 11.3262C28.8851 11.4934 29 11.7394 29 12C29 12.2606 28.8851 12.5067 28.6852 12.6738C28.6851 12.6739 28.685 12.674 28.685 12.6741L17.4368 22.0475C17.4367 22.0476 17.4366 22.0477 17.4365 22.0478C17.175 22.265 16.8101 22.313 16.5028 22.1689C16.1946 22.0243 16 21.7168 16 21.375V17.625Z"
          strokeWidth="2"
          fill="text-peach400"
        />
      </motion.svg>
    </button>
  );
};
