import { render, screen } from "@testing-library/react";
import App from "./App";

// Simple smoke test: should render auth screen prompt when not authenticated
test("renders sign in prompt", () => {
  render(<App />);
  const el = screen.getByText(/sign in to your account/i);
  expect(el).toBeInTheDocument();
});
