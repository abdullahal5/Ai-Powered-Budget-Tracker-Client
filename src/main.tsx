import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { ClerkProvider } from "@clerk/clerk-react";
import { RouterProvider } from "react-router-dom";
import router from "./router/index.tsx";
import { Providers } from "./providers/Providers.tsx";
import { Toaster } from "sonner";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const SECRET_KEY = import.meta.env.VITE_CLERK_SECRET_KEY;
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!PUBLISHABLE_KEY || !SECRET_KEY || !BASE_URL) {
  throw new Error("Add your necessary Keys to the .env file");
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div className="scroll-smooth">
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <Providers>
          <Toaster richColors />
          <RouterProvider router={router} />
        </Providers>
      </ClerkProvider>
    </div>
  </StrictMode>
);
