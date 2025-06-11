import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import { GoogleOAuthProvider } from "@react-oauth/google";

import AppRoutes from "./AppRoutes";
import AppInitializer from "./components/layout/AppInitializer";
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const App: React.FC = () => {
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <BrowserRouter>
        <Toaster position="top-center" richColors closeButton />
        <AppInitializer />
        <AppRoutes />
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
};

export default App;
