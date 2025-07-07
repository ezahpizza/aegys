import React from "react";
import ReactDOM from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import { shadesOfPurple } from '@clerk/themes'

import App from './App.tsx'
import './index.css'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key");
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}
      clerkJSVersion="5.56.0-snapshot.v20250312225817"

      appearance={{
            baseTheme: shadesOfPurple,
            layout: {
              unsafe_disableDevelopmentModeWarnings: true,
            },
      }}>
      <App />
    </ClerkProvider>
  </React.StrictMode>
);