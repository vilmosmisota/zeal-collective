export default function Logo({ theme }: { theme: "dark" | "light" }) {
  return (
    <div className="w-min h-min">
      <p
        className={`${
          theme === "dark" ? "text-zinc800" : "text-peach400"
        } capitalize font-serifHeading italic text-2xl text-center p-0 m-0 leading-none tracking-wider`}
      >
        Cinery
      </p>
    </div>
  );
}
