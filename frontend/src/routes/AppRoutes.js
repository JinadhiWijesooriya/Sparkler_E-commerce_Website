import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Routes, Route } from "react-router-dom";
import Layout from "../components/layout/Layout";
// Pages
import Home from "../pages/Home";
import Shop from "../pages/Shop";
import ProductDetails from "../pages/ProductDetails";
import CustomJewelry from "../pages/CustomJewelry";
import Services from "../pages/Services";
import Blog from "../pages/Blog";
import Contact from "../pages/Contact";
import Auth from "../pages/Auth";
import Dashboard from "../pages/Dashboard";
import BlogDetails from "../pages/BlogDetailPage";
import CartPage from "../pages/CartPage";
import InvoicePage from "../pages/InvoicePage";
import AdvertisementSection from "../components/HomeComponents/AdvertisementSection";
import JuwelerySets from "../pages/JuwelerySets";
import MoreDetais from "../pages/JuwelerySets/MoreDetails";
import BiddingPage from "../pages/BiddingPage";
import GemsPage from "../pages/GemsPage";
import GemDetailPage from "../pages/GemDetailPage";
import TrackingPage from "../pages/TrackingPage";
import PaymentSuccessPage from "../pages/PaymentSuccessPage";
export default function AppRoutes() {
    return (_jsx(Layout, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Home, {}) }), _jsx(Route, { path: "/shop", element: _jsx(Shop, {}) }), _jsx(Route, { path: "/product/:id", element: _jsx(ProductDetails, {}) }), _jsx(Route, { path: "/custom", element: _jsx(CustomJewelry, {}) }), _jsx(Route, { path: "/services", element: _jsx(Services, {}) }), _jsx(Route, { path: "/advertisements", element: _jsx(AdvertisementSection, {}) }), _jsx(Route, { path: "/blog", element: _jsx(Blog, {}) }), _jsx(Route, { path: "/blog/:id", element: _jsx(BlogDetails, {}) }), _jsx(Route, { path: "/contact", element: _jsx(Contact, {}) }), _jsx(Route, { path: "/auth", element: _jsx(Auth, {}) }), _jsx(Route, { path: "/cart", element: _jsx(CartPage, {}) }), _jsx(Route, { path: "/sets", element: _jsx(JuwelerySets, {}) }), _jsx(Route, { path: "/productSet/:id", element: _jsx(MoreDetais, {}) }), _jsx(Route, { path: "/bid", element: _jsx(BiddingPage, {}) }), _jsx(Route, { path: "/gems", element: _jsx(GemsPage, {}) }), _jsx(Route, { path: "/gem/:id", element: _jsx(GemDetailPage, {}) }), _jsx(Route, { path: "/dashboard", element: _jsx(Dashboard, {}) }), _jsx(Route, { path: "/invoice/:order_id", element: _jsx(InvoicePage, {}) }), _jsx(Route, { path: "/tracking/:order_id", element: _jsx(TrackingPage, {}) }), _jsx(Route, { path: "/payment-success/:order_id", element: _jsx(PaymentSuccessPage, {}) }), _jsx(Route, { path: "*", element: _jsx("div", { className: "flex items-center justify-center h-screen text-2xl text-[#0B0B0B]", children: "Page Not Found" }) })] }) }));
}
