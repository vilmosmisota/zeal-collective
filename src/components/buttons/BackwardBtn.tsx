import { motion } from "framer-motion";

type BackwardBtnProps = {
  handleClick: () => void;
  isHide: boolean;
};

export const BackwardBtn = ({ handleClick, isHide }: BackwardBtnProps) => {
  return (
    <button
      onClick={handleClick}
      className={` ${
        isHide
          ? "opacity-25 pointer-events-none"
          : "opacity-100 pointer-events-auto"
      } block absolute top-[50%] left-[0] -translate-y-[50%]`}
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
          d="M27.564 22.0482L27.564 22.0481L17.875 13.9749V12V10.025L27.5632 1.95247C27.8247 1.73504 28.1898 1.68695 28.4972 1.83114C28.8054 1.97569 29 2.28316 29 2.625L29 21.375C29 21.7126 28.8031 22.0241 28.4941 22.1703C28.1922 22.3132 27.8293 22.2692 27.564 22.0482ZM14 6.375V12L14 19.5V21.375C14 21.7126 13.8031 22.0241 13.4941 22.1703C13.1922 22.3132 12.8293 22.2692 12.564 22.0482L1.31505 12.674C1.31496 12.674 1.31488 12.6739 1.3148 12.6738C1.11486 12.5066 1 12.2606 1 12C1 11.7394 1.11486 11.4933 1.3148 11.3262C1.31488 11.3261 1.31496 11.326 1.31505 11.3259L12.5632 1.95247C12.5633 1.95239 12.5634 1.95231 12.5635 1.95223C12.825 1.735 13.1899 1.68701 13.4972 1.83114C13.8054 1.97569 14 2.28316 14 2.625V6.375Z"
          strokeWidth="2"
        />
      </motion.svg>
    </button>
  );
};
