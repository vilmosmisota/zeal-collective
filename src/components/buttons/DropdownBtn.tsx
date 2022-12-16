type TProps = {
  handleClick: () => void;
  isDropdownActive: boolean;
};

export default function DropdownBtn({ handleClick, isDropdownActive }: TProps) {
  return (
    <button onClick={handleClick}>
      <svg
        viewBox="0 0 15 10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        stroke="currentColor"
        className={`${
          isDropdownActive ? " fill-zinc800" : "text-peach400"
        } w-5 h-5 opacity-60 hover:opacity-100 transition-all duration-300`}
      >
        <path
          d="M6.7941 9.20582L6.44053 8.85225L6.43584 8.85694L0.791342 3.21245C0.791056 3.21216 0.79077 3.21187 0.790485 3.21158C0.50389 2.92116 0.418647 2.49319 0.573962 2.12044C0.731047 1.74343 1.09798 1.5 1.49992 1.5L1.50012 1.5L13.4999 1.49532C13.5 1.49532 13.5001 1.49532 13.5001 1.49532C13.9058 1.49536 14.2685 1.73795 14.4259 2.11575C14.5824 2.49143 14.4983 2.918 14.2104 3.20583L8.21043 9.20582C7.81976 9.5965 7.18478 9.5965 6.7941 9.20582Z"
          stroke="#EDEAD0"
          strokeOpacity="0.5"
        />
      </svg>
    </button>
  );
}
