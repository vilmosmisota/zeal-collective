import Image from "next/future/image";
import Logo from "../logo/Logo";
import burger from "../../assets/icons/burger.svg";

export default function Navbar() {
  return (
    <nav className="w-screen h-[55px] bg-peach400">
      <div className="px-4 py-2 max-w-screen-xl flex items-center justify-between mx-auto">
        <div>
          <Logo theme="dark" />
        </div>
        <div>
          <button className="cursor-pointer">
            <Image src={burger as string} alt="burger-menu" sizes="5vw" />
          </button>
        </div>
      </div>
    </nav>
  );
}
