import Navbar from "../navbar/Navbar";

export default function Layout({ children }: JSX.ElementChildrenAttribute) {
  return (
    <>
      <Navbar />
      <>{children}</>
      {/* <Footer /> */}
    </>
  );
}
