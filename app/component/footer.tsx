import Link from "next/link";
import { Twitter, Linkedin, Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 mt-10">
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left Section: Brand & Copyright */}
        <p className="text-sm">
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold">ResumeBuilder</span> — All rights
          reserved.
        </p>

        {/* Center Section: Links */}
        <div className="flex gap-4 text-sm">
          <Link
            href="/privacy"
            className="hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms"
            className="hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Terms of Service
          </Link>
          <Link
            href="/contact"
            className="hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Contact
          </Link>
        </div>

        {/* Right Section: Social Icons */}
        <div className="flex gap-3">
          <Link
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-500 transition-colors"
          >
            <Twitter size={20} />
          </Link>
          <Link
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-700 transition-colors"
          >
            <Linkedin size={20} />
          </Link>
          <Link
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <Github size={20} />
          </Link>
        </div>
      </div>
    </footer>
  );
}
