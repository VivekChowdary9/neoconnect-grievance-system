"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "../../services/authService";

export default function LoginPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => 
    {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginUser(formData);

      if (typeof window !== "undefined") {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data));
      }

      router.push("/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
      setError(
        err?.response?.data?.message ||
          "Login failed. Please check your credentials or backend."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-4 rounded-lg border p-6 shadow"
      >
        <h1 className="text-2xl font-bold">Login</h1>

        {error && <p className="text-red-600">{error}</p>}

        <input
          type="email"
          name="email"
          placeholder="Enter email"
          value={formData.email}
          onChange={handleChange}
          className="w-full rounded border p-2"
          required
       
       />

        <input
          type="password"
          name="password"
          placeholder="Enter password"
          value={formData.password}
          onChange={handleChange}
          className="w-full rounded border p-2"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-black p-2 text-white"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>






    </div>
  );
}





