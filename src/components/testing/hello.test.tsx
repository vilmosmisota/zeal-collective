import { render, screen } from "@testing-library/react";
import { Hello } from "./hello";

it("renders hello", () => {
  render(<Hello />);
  const myEl = screen.getByText(/Hello/);
  expect(myEl).toBeInTheDocument();
});
