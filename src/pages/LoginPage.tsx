import React, { useState } from "react";
import { Facebook, Mail, Phone } from "lucide-react";

export const LoginPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<"email" | "phone">("email");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = '/';
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-purple-100">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
  <h1 className="text-3xl font-bold text-purple-700 mb-6 text-center">Sign In to Wattado</h1>
        <div className="flex justify-center mb-6">
          <button
            className={`px-4 py-2 rounded-l-lg border border-r-0 ${
              selectedTab === "email"
                ? "bg-purple-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => setSelectedTab("email")}
          >
            <Mail className="inline-block mr-2 w-5 h-5" />
            Email
          </button>
          <button
            className={`px-4 py-2 rounded-r-lg border ${
              selectedTab === "phone"
                ? "bg-purple-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => setSelectedTab("phone")}
          >
            <Phone className="inline-block mr-2 w-5 h-5" />
            Phone
          </button>
        </div>
        {selectedTab === "email" ? (
          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="you@email.com"
                autoComplete="email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 mt-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
            >
              Login
            </button>
          </form>
        ) : (
          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <div className="flex">
                <select className="px-2 py-2 border border-gray-300 rounded-l-lg bg-gray-50 focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                  <option value="+44">+44 (UK)</option>
                  <option value="+1">+1 (US)</option>
                  <option value="+33">+33 (FR)</option>
                  {/* Add more country codes as needed */}
                </select>
                <input
                  type="tel"
                  className="w-full px-3 py-2 border-t border-b border-r border-gray-300 rounded-r-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Phone number"
                  autoComplete="tel"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-2 mt-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
            >
              Login
            </button>
          </form>
        )}
        <div className="my-6 flex items-center">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="mx-4 text-gray-400 font-medium">or</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>
        <button
          className="w-full flex items-center justify-center py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition mb-2"
        >
          <Facebook className="w-5 h-5 mr-2" />
          Continue with Facebook
        </button>
        <div className="text-center mt-4">
          <span className="text-gray-600">Don't have an account?</span>
          <a
            href="/signup"
            className="ml-2 text-purple-600 font-semibold hover:underline"
          >
            Sign up instead
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
