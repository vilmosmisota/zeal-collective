export default function Logo({ theme }: { theme: "dark" | "light" }) {
  return (
    <div className="w-min h-min">
      <p
        className={`${
          theme === "dark" ? "text-zinc800" : "text-peach400"
        } uppercase font-logo text-2xl text-center p-0 m-0 leading-none tracking-wider`}
      >
        Zeal
      </p>
      <p
        className={`${
          theme === "dark" ? "text-zinc800" : "text-peach400"
        } lowercase font-sansHeading text-sm text-center p-0 m-0 leading-none -mt-[1px]`}
      >
        Collective
      </p>
    </div>
  );
}
