"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "../components/ui/Button";
import { getArticleById } from "../api/blogApi";
// ---------------- HELPER: group lines for chapter-like display ----------------
function groupLinesExact(content) {
    const lines = content.split("\n").filter(line => line.trim() !== "");
    const groups = [];
    let i = 0;
    while (i < lines.length) {
        // Combine every 3rd+4th line to match your example
        if ((i + 1) % 3 === 0 && i + 1 < lines.length) {
            groups.push([lines[i], lines[i + 1]]);
            i += 2;
        }
        else {
            groups.push([lines[i]]);
            i += 1;
        }
    }
    return groups;
}
export default function BlogDetails() {
    const { id } = useParams();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        if (!id)
            return;
        const fetchArticle = async () => {
            try {
                const data = await getArticleById(Number(id));
                setArticle(data);
            }
            catch {
                setError("Failed to load article.");
            }
            finally {
                setLoading(false);
            }
        };
        fetchArticle();
    }, [id]);
    if (loading)
        return (_jsx("div", { className: "h-screen flex items-center justify-center text-[#C9A24D] text-xl", children: "Loading article..." }));
    if (error || !article)
        return (_jsx("div", { className: "h-screen flex items-center justify-center text-red-500 text-lg", children: error ?? "Article not found" }));
    const groupedContent = groupLinesExact(article.content);
    const handleWhatsAppConsultation = () => {
        const whatsappNumber = "94705696254"; // your number
        const message = `Hello! I would like to request a consultation regarding the article: "${article?.title}".
Could you guide me in selecting the perfect gemstone or designing a custom piece?`;
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, "_blank"); // Opens WhatsApp
    };
    return (_jsxs("section", { className: "relative overflow-x-hidden bg-[#0d0d0d]", children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-[#0f0f0f] via-[#1a1a1a] to-[#0f0f0f] animate-gradient-x opacity-60 -z-10" }), _jsx("div", { className: "absolute inset-0 bg-[url('/textures/subtle-dots.svg')] bg-repeat opacity-10 -z-5" }), _jsxs(motion.div, { initial: { opacity: 0, scale: 1.05 }, animate: { opacity: 1, scale: 1 }, transition: { duration: 1, ease: "easeOut" }, className: "relative h-[60vh] sm:h-[70vh] md:h-[80vh] flex items-center justify-center rounded-b-[3rem] sm:rounded-b-[4rem] overflow-hidden shadow-2xl", style: {
                    backgroundImage: `url(${article.featured_image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }, children: [_jsx("div", { className: "absolute inset-0 bg-black/70 backdrop-blur-sm" }), _jsxs(motion.div, { initial: { opacity: 0, y: 60 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.3, duration: 1 }, className: "relative z-10 text-center px-4 sm:px-6 md:px-0 max-w-4xl", children: [_jsx("span", { className: "text-[10px] sm:text-xs tracking-[0.35em] uppercase text-[#C9A24D]", children: article.category }), _jsx("h1", { className: "text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading text-[#C9A24D] mt-4 sm:mt-6 mb-4 sm:mb-6 leading-tight drop-shadow-xl", children: article.title }), _jsx("p", { className: "text-[#BDBDBD] text-sm sm:text-base md:text-lg leading-relaxed mb-6 sm:mb-8 drop-shadow-sm", children: article.description }), _jsxs("div", { className: "flex justify-center gap-4 sm:gap-6 flex-wrap", children: [_jsx(Link, { to: "/shop", children: _jsx(Button, { className: "px-8 sm:px-14 py-2 sm:py-4 rounded-full bg-gradient-to-r from-[#C9A24D]/80 to-[#FFD700]/80 shadow-lg hover:scale-105 transform transition", children: "Shop Collection" }) }), _jsx(Link, { to: "/blog", children: _jsx(Button, { variant: "outline", className: "px-8 sm:px-14 py-2 sm:py-4 rounded-full border-[#C9A24D] hover:bg-[#C9A24D]/10 transition", children: "Back to Blog" }) })] })] })] }), _jsxs("section", { className: "max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-16 sm:py-24 space-y-16 sm:space-y-20 relative z-10", children: [groupedContent.map((group, i) => (_jsxs(motion.div, { initial: { opacity: 0, y: 30, scale: 0.95 }, whileInView: { opacity: 1, y: 0, scale: 1 }, viewport: { once: true }, transition: { delay: i * 0.15, duration: 0.9 }, className: "backdrop-blur-md bg-[#1a1a1a]/60 border border-[#C9A24D]/20 p-6 sm:p-8 md:p-10 rounded-3xl shadow-xl relative overflow-hidden", children: [_jsx("div", { className: "absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-[#FFD700] to-[#C9A24D] rounded-full" }), group.map((line, j) => (_jsx("p", { className: "text-[#EDEDED] text-base sm:text-lg md:text-xl leading-relaxed mb-2 sm:mb-3", children: line }, j)))] }, i))), article.images.length > 0 && (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-12", children: article.images.map((img, i) => (_jsx(motion.div, { initial: { opacity: 0, y: 20, scale: 0.95 }, whileInView: { opacity: 1, y: 0, scale: 1 }, viewport: { once: true }, transition: { delay: i * 0.15, duration: 0.8 }, className: "rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl md:shadow-2xl border border-[#C9A24D]/30 hover:shadow-[#C9A24D]/40 hover:scale-105 transform transition", children: _jsx("img", { src: img.image, alt: img.caption ?? article.title, className: "w-full h-64 sm:h-72 md:h-96 object-cover" }) }, img.id))) })), _jsxs(motion.div, { initial: { opacity: 0, y: 20, scale: 0.95 }, whileInView: { opacity: 1, y: 0, scale: 1 }, viewport: { once: true }, transition: { duration: 1 }, className: "text-center space-y-6 sm:space-y-8 mt-16 sm:mt-24", children: [_jsx("h2", { className: "text-3xl sm:text-4xl md:text-4xl lg:text-5xl text-[#C9A24D] font-bold drop-shadow-xl", children: "Want Personalized Guidance?" }), _jsx("p", { className: "text-[#BDBDBD] max-w-xl sm:max-w-2xl mx-auto text-sm sm:text-base md:text-lg drop-shadow-sm", children: "Our experts can guide you through selecting the perfect gemstone or designing a bespoke piece of jewelry." }), _jsxs("div", { className: "flex justify-center gap-3 sm:gap-6 flex-wrap", children: [_jsx(Button, { className: "px-6 sm:px-14 py-2 sm:py-4 rounded-full bg-gradient-to-r from-[#C9A24D]/80 to-[#FFD700]/80 shadow-lg hover:scale-105 transform transition", onClick: handleWhatsAppConsultation, children: "Book Consultation" }), _jsx(Link, { to: "/blog", children: _jsx(Button, { variant: "outline", className: "px-6 sm:px-14 py-2 sm:py-4 rounded-full border-[#C9A24D] hover:bg-[#C9A24D]/10 transition", children: "Back to Blog" }) })] })] })] })] }));
}
