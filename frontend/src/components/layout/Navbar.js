import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaTimes, FaChevronDown } from "react-icons/fa";
export default function Navbar() {
    const { pathname } = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [shopDropdownOpen, setShopDropdownOpen] = useState(false); // Desktop dropdown
    const [mobileShopDropdownOpen, setMobileShopDropdownOpen] = useState(false); // Mobile dropdown
    const shopRef = useRef(null);
    const navLinks = [
        { name: "Services", path: "/services" },
        { name: "Blog", path: "/blog" },
        { name: "Custom", path: "/custom" },
        { name: "Contact", path: "/contact" },
    ];
    // Close desktop dropdown if clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (shopRef.current && !shopRef.current.contains(e.target)) {
                setShopDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    // Close mobile menu + dropdown
    const handleMobileLinkClick = () => {
        setMobileMenuOpen(false);
        setMobileShopDropdownOpen(false);
    };
    return (_jsxs("nav", { className: "sticky top-0 z-30 bg-charcoal border-b border-gold/30 shadow-lg", children: [_jsxs("div", { className: "max-w-7xl mx-auto px-6 py-3 flex justify-between items-center", children: [_jsxs(Link, { to: "/", className: "flex items-center gap-3 group transition-transform duration-300 hover:scale-105", children: [_jsx("div", { className: "flex items-center justify-center w-12 h-12 rounded-full bg-black/50 border border-gold/50 shadow-sm group-hover:shadow-gold/40 transition-all duration-500", children: _jsx("img", { src: "/logo/JewelryLogo.png", alt: "SPARKLER Logo", className: "w-9 h-9 object-contain transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110" }) }), _jsx("h1", { className: "text-textPrimary font-serif text-xl md:text-2xl font-bold tracking-wide group-hover:text-gold transition-colors", children: "SPARKLER" })] }), _jsxs("div", { className: "hidden md:flex gap-10 text-sm md:text-base font-medium items-center relative", children: [_jsx(Link, { to: "/", className: `relative px-2 py-1 transition-all duration-300 ${pathname === "/"
                                    ? "text-gold after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-gold"
                                    : "text-textPrimary hover:text-gold group"}`, children: "Home" }), _jsx(Link, { to: "/bid", className: `relative px-2 py-1 transition-all duration-300 ${pathname === "/bid"
                                    ? "text-gold after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-gold"
                                    : "text-textPrimary hover:text-gold group"}`, children: "Bidding" }), _jsxs("div", { ref: shopRef, className: "relative", children: [_jsxs("button", { onClick: () => setShopDropdownOpen(prev => !prev), className: `flex items-center gap-1 px-2 py-1 transition-all duration-300 ${pathname === "/shop" || pathname === "/sets"
                                            ? "text-gold after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-gold"
                                            : "text-textPrimary hover:text-gold"}`, children: ["Shop", _jsx(FaChevronDown, { className: `text-xs mt-1 transition-transform ${shopDropdownOpen ? "rotate-180" : ""}` })] }), shopDropdownOpen && (_jsxs("div", { className: "absolute top-full left-0 mt-2 w-40 bg-charcoal border border-gold/50 rounded-md shadow-lg z-50", children: [_jsx(Link, { to: "/shop", onClick: () => setShopDropdownOpen(false), className: `block px-4 py-2 transition-colors ${pathname === "/shop" ? "bg-gold text-charcoal" : "hover:bg-gold/30 hover:text-gold"}`, children: "Jewellery" }), _jsx(Link, { to: "/sets", onClick: () => setShopDropdownOpen(false), className: `block px-4 py-2 transition-colors ${pathname === "/sets" ? "bg-gold text-charcoal" : "hover:bg-gold/30 hover:text-gold"}`, children: "Jewellery Sets" }), _jsx(Link, { to: "/gems", onClick: () => setShopDropdownOpen(false), className: `block px-4 py-2 transition-colors ${pathname === "/gems" ? "bg-gold text-charcoal" : "hover:bg-gold/30 hover:text-gold"}`, children: "Gems" })] }))] }), navLinks.map(link => (_jsx(Link, { to: link.path, className: `relative px-2 py-1 transition-all duration-300 ${pathname === link.path
                                    ? "text-gold after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-gold"
                                    : "text-textPrimary hover:text-gold group"}`, children: link.name }, link.name)))] }), _jsx("div", { className: "md:hidden", children: _jsx("button", { onClick: () => setMobileMenuOpen(prev => !prev), className: "text-textPrimary hover:text-gold transition-colors text-2xl", children: mobileMenuOpen ? _jsx(FaTimes, {}) : _jsx(FaBars, {}) }) })] }), mobileMenuOpen && (_jsx("div", { className: "md:hidden bg-charcoal border-t border-gold/30 shadow-lg", children: _jsxs("ul", { className: "flex flex-col gap-3 px-6 py-4 text-textPrimary", children: [_jsx("li", { children: _jsx(Link, { to: "/", onClick: handleMobileLinkClick, className: `block px-3 py-2 rounded-md transition-colors ${pathname === "/" ? "bg-gold text-charcoal font-semibold" : "hover:bg-gold/30 hover:text-gold"}`, children: "Home" }) }), _jsx("li", { children: _jsx(Link, { to: "/bid", onClick: handleMobileLinkClick, className: `block px-3 py-2 rounded-md transition-colors ${pathname === "/bid" ? "bg-gold text-charcoal font-semibold" : "hover:bg-gold/30 hover:text-gold"}`, children: "Bid" }) }), _jsxs("li", { children: [_jsxs("button", { onClick: () => setMobileShopDropdownOpen(prev => !prev), className: "flex justify-between items-center w-full px-3 py-2 rounded-md hover:bg-gold/30 hover:text-gold transition-colors", children: ["Shop", _jsx(FaChevronDown, { className: `transition-transform ${mobileShopDropdownOpen ? "rotate-180" : ""}` })] }), mobileShopDropdownOpen && (_jsxs("ul", { className: "flex flex-col ml-4 mt-1 gap-1", children: [_jsx("li", { children: _jsx(Link, { to: "/shop", onClick: handleMobileLinkClick, className: `block px-3 py-2 rounded-md transition-colors ${pathname === "/shop" ? "bg-gold text-charcoal font-semibold" : "hover:bg-gold/30 hover:text-gold"}`, children: "Jewellery" }) }), _jsx("li", { children: _jsx(Link, { to: "/sets", onClick: handleMobileLinkClick, className: `block px-3 py-2 rounded-md transition-colors ${pathname === "/sets" ? "bg-gold text-charcoal font-semibold" : "hover:bg-gold/30 hover:text-gold"}`, children: "Jewellery Sets" }) }), _jsx("li", { children: _jsx(Link, { to: "/gems", onClick: handleMobileLinkClick, className: `block px-3 py-2 rounded-md transition-colors ${pathname === "/gems" ? "bg-gold text-charcoal font-semibold" : "hover:bg-gold/30 hover:text-gold"}`, children: "Gems" }) })] }))] }), navLinks.map(link => (_jsx("li", { children: _jsx(Link, { to: link.path, onClick: handleMobileLinkClick, className: `block px-3 py-2 rounded-md transition-colors ${pathname === link.path ? "bg-gold text-charcoal font-semibold" : "hover:bg-gold/30 hover:text-gold"}`, children: link.name }) }, link.name)))] }) }))] }));
}
