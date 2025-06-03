import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import AppRoutes from "./AppRoutes";
import AppInitializer from "./components/layout/AppInitializer";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Toaster position="top-center" richColors closeButton />
      <AppInitializer />
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App;
