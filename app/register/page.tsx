"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess("Registered successfully! Redirecting to login...");
        setTimeout(() => router.push("/login"), 1500);
      } else {
        setError(data.error || "Registration failed");
      }
    } catch {
      setError("Something went wrong. Try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 border border-gray-100 animate-fadeIn"
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Create Account
        </h2>
        <p className="text-center text-gray-500 mb-6">Sign up to get started</p>

        {error && (
          <p className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm text-center">
            {error}
          </p>
        )}
        {success && (
          <p className="bg-green-100 text-green-700 p-3 rounded mb-4 text-sm text-center">
            {success}
          </p>
        )}

        {/* NAME */}
        <div>
          <label className="text-gray-700 font-medium">Name</label>
          <input
            name="name"
            className="mt-1 border rounded-lg p-3 w-full focus:ring-2 focus:ring-green-500 outline-none transition"
            placeholder="Enter your name"
            type="text"
            required
            value={form.name}
            onChange={handleChange}
          />
        </div>

        {/* EMAIL */}
        <div className="mt-4">
          <label className="text-gray-700 font-medium">Email</label>
          <input
            name="email"
            className="mt-1 border rounded-lg p-3 w-full focus:ring-2 focus:ring-green-500 outline-none transition"
            placeholder="Enter your email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
          />
        </div>

        {/* PASSWORD */}
        <div className="mt-4 relative">
          <label className="text-gray-700 font-medium">Password</label>
          <input
            name="password"
            className="mt-1 border rounded-lg p-3 w-full pr-12 focus:ring-2 focus:ring-green-500 outline-none transition"
            placeholder="Enter your password"
            type={showPass ? "text" : "password"}
            required
            value={form.password}
            onChange={handleChange}
          />
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="absolute right-3 top-11 text-gray-500 hover:text-gray-700"
          >
            {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={loading}
          className={`mt-6 bg-green-600 text-white w-full p-3 rounded-lg text-lg font-medium 
            hover:bg-green-700 transition flex items-center justify-center gap-2
            disabled:bg-green-400 disabled:cursor-not-allowed`}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Registering...
            </>
          ) : (
            "Register"
          )}
        </button>

        {/* LOGIN LINK */}
        <p className="text-center mt-6 text-gray-600 text-sm">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-green-600 hover:underline font-medium"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
