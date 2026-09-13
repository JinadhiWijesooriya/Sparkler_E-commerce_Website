"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { getArticles, type Article } from "../../api/blogApi";

/* ---------------- SPARKLES (STATIC) ---------------- */
const generateSparkles = () => {
  const sparkles = [];
  for (let i = 0; i < 20; i++) {
    sparkles.push({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      duration: 4 + Math.random() * 3,
      delay: Math.random() * 2,
    });
  }
  return sparkles;
};

const sparkles = generateSparkles();

/* ---------------- COMPONENT ---------------- */
export default function BlogPreview() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestBlogs = async () => {
      try {
        const data = await getArticles({
          ordering: "-created_at",
          page: 1,
        });

        setArticles(data.slice(0, 4));
      } catch (error) {
        console.error("Failed to load blog preview", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestBlogs();
  }, []);

  if (loading) {
    return (
      <div className="py-16 md:py-20 text-center text-[#C9A24D] text-sm md:text-base">
        Loading latest articles...
      </div>
    );
  }

  if (articles.length === 0) return null;

  return (
    <section className="relative py-16 sm:py-20 bg-[#1A1A1A] overflow-hidden">

      {/* ================= BACKGROUND EFFECTS ================= */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute w-72 h-72 md:w-96 md:h-96 rounded-full
            bg-purple-700/30 top-[-10%] left-[-10%] blur-3xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-64 h-64 md:w-80 md:h-80 rounded-full
            bg-purple-500/20 bottom-[-5%] right-[-5%] blur-2xl"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
        {sparkles.map((s, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 md:w-2 md:h-2
              rounded-full bg-purple-400/50"
            style={{ top: s.top, left: s.left }}
            animate={{ y: [0, -10, 0], opacity: [0.3, 0.7, 0.3] }}
            transition={{
              duration: s.duration,
              repeat: Infinity,
              repeatType: "mirror",
              delay: s.delay,
            }}
          />
        ))}
      </div>

      {/* ================= CONTENT ================= */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 z-10">
        <h2
          className="text-3xl sm:text-4xl md:text-5xl
          font-heading text-[#EDEDED]
          mb-10 md:mb-12 text-center"
        >
          From Our Blog
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {articles.map((article, i) => (
            <motion.div
              key={article.id}
              className="rounded-2xl overflow-hidden bg-[#0D0D0D]
                border border-[#C9A24D]/20 shadow-lg cursor-pointer"
              whileHover={{ scale: 1.04 }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.7 }}
            >
              {/* IMAGE */}
              <div className="relative">
                <img
                  src={article.featured_image}
                  alt={article.title}
                  className="w-full h-44 sm:h-48 md:h-52 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>

              {/* CONTENT */}
              <div className="p-4 sm:p-5">
                <p className="text-xs text-[#BDBDBD] mb-2">
                  {new Date(article.created_at).toLocaleDateString()}
                </p>

                <h3 className="text-[#C9A24D] text-base sm:text-lg font-semibold mb-2">
                  {article.title}
                </h3>

                <p className="text-[#EDEDED] text-sm line-clamp-3 mb-4">
                  {article.description}
                </p>

                <Link to={`/blog/${article.id}`}>
                  <motion.button
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 0 15px rgba(201,162,77,0.5)",
                    }}
                    className="w-full sm:w-auto
                      bg-[#C9A24D] hover:bg-[#B08B3E]
                      text-[#1A1A1A]
                      py-2.5 px-6 rounded-2xl
                      text-sm font-medium
                      transition-all duration-300"
                  >
                    Read More
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
