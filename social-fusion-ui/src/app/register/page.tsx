"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    console.log("Registered with:", { email, password });
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        {/* Logo & Home Link */}
        <div className="flex justify-center mb-4">
        <Logo/>
        </div>

        {/* Header */}
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white">
          Create an Account
        </h2>
        <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
          Sign up to start using Social Fusion
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              className="w-full p-2 border rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <input
              type="password"
              className="w-full p-2 border rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Confirm Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Confirm Password
            </label>
            <input
              type="password"
              className="w-full p-2 border rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold p-2 rounded-md transition duration-200"
          >
            Sign Up
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-500 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
