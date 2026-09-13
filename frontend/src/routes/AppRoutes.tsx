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
  return (
    <Layout>
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/custom" element={<CustomJewelry />} />
        <Route path="/services" element={<Services />} />
        <Route path="/advertisements" element={<AdvertisementSection />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogDetails />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/sets" element={<JuwelerySets />} />
        <Route path="/productSet/:id" element={<MoreDetais />} />
        <Route path="/bid" element={<BiddingPage />} />
        <Route path="/gems" element={<GemsPage />} />
        <Route path="/gem/:id" element={<GemDetailPage />} />



        {/* User Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/invoice/:order_id" element={<InvoicePage />} />
        <Route path="/tracking/:order_id" element={<TrackingPage />} />
        <Route path="/payment-success/:order_id" element={<PaymentSuccessPage />} />
        {/* 404 Fallback */}
        <Route
          path="*"
          element={
            <div className="flex items-center justify-center h-screen text-2xl text-[#0B0B0B]">
              Page Not Found
            </div>
          }
        />
      </Routes>
    </Layout>
  );
}
