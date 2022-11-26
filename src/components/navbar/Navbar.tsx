import Image from "next/future/image";
import Logo from "../logo/Logo";
import burger from "../../assets/icons/burger.svg";

export default function Navbar() {
  const theme: "dark" | "light" = "dark";
  return (
    <nav
      className={`${
        theme === "dark" ? "bg-black" : "bg-peach400"
      } w-screen h-[60px]   z-50 flex justify-center fixed top-0 left-0`}
    >
      <div className="px-4 py-2 w-full max-w-screen-xl flex items-center justify-between mx-auto">
        <div>
          <Logo theme="light" />
        </div>
        <div>
          <button className="cursor-pointer">
            <BurgerIcon theme={theme} />
          </button>
        </div>
      </div>
    </nav>
  );
}

const BurgerIcon = ({ theme }: { theme: "dark" | "light" }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className={`w-6 h-6 ${
        theme === "light" ? "text-zinc800" : "text-peach400"
      }`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 9h16.5m-16.5 6.75h16.5"
      />
    </svg>
  );
};
