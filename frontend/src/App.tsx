import AppRoutes from "./routes/AppRoutes";
import { CurrencyProvider } from "./context/CurrencyContext";
import { AuthProvider } from "./context/AuthContext";

import { Toaster } from "react-hot-toast";
import { CartProvider } from "./context/CartProvider";

export default function App() {
  return (
    <AuthProvider>
      <CurrencyProvider>
        <CartProvider>
          <AppRoutes />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#1A1A1A",
                color: "#C9A24D",
                fontWeight: "bold",
              },
            }}
          />
        </CartProvider>
      </CurrencyProvider>
    </AuthProvider>
  );
}
