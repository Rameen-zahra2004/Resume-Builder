"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    setLoading(false);

    if (res?.ok) {
      router.push("/dashboard");
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 border border-gray-100 animate-fadeIn"
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Welcome Back 👋
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Login to access your dashboard
        </p>

        {error && (
          <p className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm text-center">
            {error}
          </p>
        )}

        {/* EMAIL */}
        <div>
          <label className="text-gray-700 font-medium">Email</label>
          <input
            className="mt-1 border rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 outline-none transition"
            placeholder="Enter your email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* PASSWORD */}
        <div className="mt-4 relative">
          <label className="text-gray-700 font-medium">Password</label>
          <input
            className="mt-1 border rounded-lg p-3 w-full pr-12 focus:ring-2 focus:ring-blue-500 outline-none transition"
            placeholder="Enter your password"
            type={showPass ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
          className={`mt-6 bg-blue-600 text-white w-full p-3 rounded-lg text-lg font-medium 
            hover:bg-blue-700 transition flex items-center justify-center gap-2
            disabled:bg-blue-400 disabled:cursor-not-allowed`}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </button>

        {/* REGISTER LINK */}
        <p className="text-center mt-6 text-gray-600 text-sm">
          Don’t have an account?{" "}
          <Link
            href="/register"
            className="text-blue-600 hover:underline font-medium"
          >
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
