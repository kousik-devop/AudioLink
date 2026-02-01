import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    userType: "user",
  });

  const [error, setError] = useState("");
  const [showGoogleHint, setShowGoogleHint] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setShowGoogleHint(false);

    try {
      await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          email: form.email,
          fullname: {
            firstName: form.firstName,
            lastName: form.lastName,
          },
          password: form.password,
          role: form.userType,
        },
        { withCredentials: true }
      );

      navigate("/");
    } catch (err) {
      const status = err.response?.status;

      if (status === 500) {
        setError(
          "This account already exists using Google. Please sign up with Google."
        );
        setShowGoogleHint(true);
      } else {
        setError(err.response?.data?.message || "Registration failed");
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
      <div className="w-full max-w-md bg-gray-900 rounded-xl p-6 md:p-8 space-y-6 shadow-lg border border-gray-800">

        {/* Header */}
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold text-white">Create account</h2>
          <p className="text-sm text-gray-400">
            Join us to get started
          </p>
        </div>

        {/* Google Register */}
        <button
          type="button"
          onClick={() =>
            (window.location.href =
              "http://localhost:5000/api/auth/google")
          }
          className="w-full flex items-center justify-center gap-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg py-2.5 transition"
        >
          <span className="text-sm font-medium text-gray-200">
            Continue with Google
          </span>
        </button>

        {/* Error */}
        {error && (
          <div className="bg-red-900/30 border border-red-700 text-red-400 px-4 py-2 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Google Hint */}
        {showGoogleHint && (
          <button
            type="button"
            onClick={() =>
              (window.location.href =
                "http://localhost:5000/api/auth/google")
            }
            className="w-full bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg py-2 text-sm text-gray-200"
          >
            Continue with Google
          </button>
        )}

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-800" />
          <span className="text-xs text-gray-500">OR</span>
          <div className="flex-1 h-px bg-gray-800" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <div className="flex gap-3">
            <input
              type="text"
              name="firstName"
              placeholder="First name"
              value={form.firstName}
              onChange={handleChange}
              required
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last name"
              value={form.lastName}
              onChange={handleChange}
              required
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <input
            type="password"
            name="password"
            placeholder="Password (min 8 chars)"
            value={form.password}
            onChange={handleChange}
            required
            minLength={8}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          {/* Account Type */}
          <div className="flex gap-6 text-sm text-gray-300">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="userType"
                value="user"
                checked={form.userType === "user"}
                onChange={handleChange}
                className="accent-green-500"
              />
              User
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="userType"
                value="artist"
                checked={form.userType === "artist"}
                onChange={handleChange}
                className="accent-green-500"
              />
              Artist
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold py-2.5 rounded-lg transition"
          >
            Create account
          </button>
        </form>
      </div>
    </div>
  );
}
