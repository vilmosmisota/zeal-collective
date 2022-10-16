type PauseBtnProps = {
  handleClick: () => void;
};

export const PauseBtn = ({ handleClick }: PauseBtnProps) => {
  return (
    <button className="mx-4 md:mx-8" onClick={handleClick}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="w-6 h-6 text-peach400"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 5.25v13.5m-7.5-13.5v13.5"
        />
      </svg>
    </button>
  );
};
