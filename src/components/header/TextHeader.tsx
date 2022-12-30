import GrainCanvas from "../canvas/GrainCanvas";

export default function TextHeader() {
  return (
    <header className="text-center bg-zinc800  pb-10 pt-20 px-4 relative ">
      <GrainCanvas />
      <div className="max-w-screen-xl mx-auto">
        <h1 className="text-peach400 max-w-lg mx-auto ">
          Transform the way you view photography with Cinery
        </h1>
      </div>
    </header>
  );
}
