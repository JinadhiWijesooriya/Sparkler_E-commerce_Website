import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import AppRoutes from "./routes/AppRoutes";
import { CurrencyProvider } from "./context/CurrencyContext";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import { CartProvider } from "./context/CartProvider";
export default function App() {
    return (_jsx(AuthProvider, { children: _jsx(CurrencyProvider, { children: _jsxs(CartProvider, { children: [_jsx(AppRoutes, {}), _jsx(Toaster, { position: "top-right", toastOptions: {
                            style: {
                                background: "#1A1A1A",
                                color: "#C9A24D",
                                fontWeight: "bold",
                            },
                        } })] }) }) }));
}
