"use client";

import Navbar from "./component/navbar";
import Hero from "./component/hero";
import Features from "./component/features";
import Footer from "./component/footer";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="bg-gray-50 text-gray-900">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section with animation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Hero />
      </motion.div>

      {/* Features Section with fade-in */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.2 } },
        }}
      >
        <Features />
      </motion.div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
