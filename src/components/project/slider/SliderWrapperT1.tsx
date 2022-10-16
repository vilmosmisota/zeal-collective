export default function SliderWrapperT1({
  children,
}: JSX.ElementChildrenAttribute) {
  return (
    <div className={`flex w-full items-center`}>
      <>{children}</>
    </div>
  );
}
