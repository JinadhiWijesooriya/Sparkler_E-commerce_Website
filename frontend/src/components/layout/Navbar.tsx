import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaTimes, FaChevronDown } from "react-icons/fa";

export default function Navbar() {
  const { pathname } = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false); // Desktop dropdown
  const [mobileShopDropdownOpen, setMobileShopDropdownOpen] = useState(false); // Mobile dropdown

  const shopRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { name: "Services", path: "/services" },
    { name: "Blog", path: "/blog" },
    { name: "Custom", path: "/custom" },
    { name: "Contact", path: "/contact" },
  ];

  // Close desktop dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (shopRef.current && !shopRef.current.contains(e.target as Node)) {
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

  return (
    <nav className="sticky top-0 z-30 bg-charcoal border-b border-gold/30 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 group transition-transform duration-300 hover:scale-105"
        >
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-black/50 border border-gold/50 shadow-sm group-hover:shadow-gold/40 transition-all duration-500">
            <img
              src="/logo/JewelryLogo.png"
              alt="SPARKLER Logo"
              className="w-9 h-9 object-contain transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110"
            />
          </div>
          <h1 className="text-textPrimary font-serif text-xl md:text-2xl font-bold tracking-wide group-hover:text-gold transition-colors">
            SPARKLER
          </h1>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-10 text-sm md:text-base font-medium items-center relative">
          {/* Home */}
          <Link
            to="/"
            className={`relative px-2 py-1 transition-all duration-300 ${pathname === "/"
              ? "text-gold after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-gold"
              : "text-textPrimary hover:text-gold group"
              }`}
          >
            Home
          </Link>

          {/* Bid */}
          <Link
            to="/bid"
            className={`relative px-2 py-1 transition-all duration-300 ${pathname === "/bid"
              ? "text-gold after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-gold"
              : "text-textPrimary hover:text-gold group"
              }`}
          >
            Bidding
          </Link>

          {/* Shop Dropdown */}
          <div ref={shopRef} className="relative">
            <button
              onClick={() => setShopDropdownOpen(prev => !prev)}
              className={`flex items-center gap-1 px-2 py-1 transition-all duration-300 ${pathname === "/shop" || pathname === "/sets"
                ? "text-gold after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-gold"
                : "text-textPrimary hover:text-gold"
                }`}
            >
              Shop
              <FaChevronDown
                className={`text-xs mt-1 transition-transform ${shopDropdownOpen ? "rotate-180" : ""
                  }`}
              />
            </button>

            {shopDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-40 bg-charcoal border border-gold/50 rounded-md shadow-lg z-50">
                <Link
                  to="/shop"
                  onClick={() => setShopDropdownOpen(false)}
                  className={`block px-4 py-2 transition-colors ${pathname === "/shop" ? "bg-gold text-charcoal" : "hover:bg-gold/30 hover:text-gold"
                    }`}
                >
                  Jewellery
                </Link>
                <Link
                  to="/sets"
                  onClick={() => setShopDropdownOpen(false)}
                  className={`block px-4 py-2 transition-colors ${pathname === "/sets" ? "bg-gold text-charcoal" : "hover:bg-gold/30 hover:text-gold"
                    }`}
                >
                  Jewellery Sets
                </Link>
                <Link
                  to="/gems"
                  onClick={() => setShopDropdownOpen(false)}
                  className={`block px-4 py-2 transition-colors ${pathname === "/gems" ? "bg-gold text-charcoal" : "hover:bg-gold/30 hover:text-gold"
                    }`}
                >
                  Gems
                </Link>

              </div>
            )}
          </div>

          {/* Other Links */}
          {navLinks.map(link => (
            <Link
              key={link.name}
              to={link.path}
              className={`relative px-2 py-1 transition-all duration-300 ${pathname === link.path
                ? "text-gold after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-gold"
                : "text-textPrimary hover:text-gold group"
                }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileMenuOpen(prev => !prev)}
            className="text-textPrimary hover:text-gold transition-colors text-2xl"
          >
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-charcoal border-t border-gold/30 shadow-lg">
          <ul className="flex flex-col gap-3 px-6 py-4 text-textPrimary">
            {/* Home */}
            <li>
              <Link
                to="/"
                onClick={handleMobileLinkClick}
                className={`block px-3 py-2 rounded-md transition-colors ${pathname === "/" ? "bg-gold text-charcoal font-semibold" : "hover:bg-gold/30 hover:text-gold"
                  }`}
              >
                Home
              </Link>
            </li>

            {/* Bid */}
            <li>
              <Link
                to="/bid"
                onClick={handleMobileLinkClick}
                className={`block px-3 py-2 rounded-md transition-colors ${pathname === "/bid" ? "bg-gold text-charcoal font-semibold" : "hover:bg-gold/30 hover:text-gold"
                  }`}
              >
                Bid
              </Link>
            </li>

            {/* Shop Mobile Dropdown */}
            <li>
              <button
                onClick={() => setMobileShopDropdownOpen(prev => !prev)}
                className="flex justify-between items-center w-full px-3 py-2 rounded-md hover:bg-gold/30 hover:text-gold transition-colors"
              >
                Shop
                <FaChevronDown
                  className={`transition-transform ${mobileShopDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {mobileShopDropdownOpen && (
                <ul className="flex flex-col ml-4 mt-1 gap-1">
                  <li>
                    <Link
                      to="/shop"
                      onClick={handleMobileLinkClick}
                      className={`block px-3 py-2 rounded-md transition-colors ${pathname === "/shop" ? "bg-gold text-charcoal font-semibold" : "hover:bg-gold/30 hover:text-gold"
                        }`}
                    >
                      Jewellery
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/sets"
                      onClick={handleMobileLinkClick}
                      className={`block px-3 py-2 rounded-md transition-colors ${pathname === "/sets" ? "bg-gold text-charcoal font-semibold" : "hover:bg-gold/30 hover:text-gold"
                        }`}
                    >
                      Jewellery Sets
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/gems"
                      onClick={handleMobileLinkClick}
                      className={`block px-3 py-2 rounded-md transition-colors ${pathname === "/gems" ? "bg-gold text-charcoal font-semibold" : "hover:bg-gold/30 hover:text-gold"
                        }`}
                    >
                      Gems
                    </Link>
                  </li>

                </ul>
              )}
            </li>

            {/* Other Links */}
            {navLinks.map(link => (
              <li key={link.name}>
                <Link
                  to={link.path}
                  onClick={handleMobileLinkClick}
                  className={`block px-3 py-2 rounded-md transition-colors ${pathname === link.path ? "bg-gold text-charcoal font-semibold" : "hover:bg-gold/30 hover:text-gold"
                    }`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
