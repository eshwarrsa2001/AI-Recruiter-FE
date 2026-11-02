import { StrictMode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { App } from "./App";

export function mountApplication(root: HTMLElement | null): Root | null {
  if (root === null) {
    return null;
  }
  const application = createRoot(root);
  application.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
  return application;
}
