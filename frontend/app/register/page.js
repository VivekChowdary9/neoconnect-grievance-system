"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "../../services/authService";

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "staff",
    department: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await registerUser(formData);
      setSuccess("Registration successful");
      router.push("/login");
    } catch (err) {
      console.error("Register failed:", err);
      setError(
        err?.response?.data?.message ||
          "Registration failed. Please check backend connection."
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
        <h1 className="text-2xl font-bold">Register</h1>

        {error && <p className="text-red-600">{error}</p>}
        {success && <p className="text-green-600">{success}</p>}

        <input
          type="text"
          name="name"
          placeholder="Enter name"
          value={formData.name}
          onChange={handleChange}
          className="w-full rounded border p-2"
          required
        />

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

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full rounded border p-2"
        >
          <option value="staff">staff</option>
          <option value="secretariat">secretariat</option>
          <option value="case_manager">case_manager</option>
          <option value="admin">admin</option>
        </select>

        <input
          type="text"
          name="department"
          placeholder="Enter department"
          value={formData.department}
          onChange={handleChange}
          className="w-full rounded border p-2"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-black p-2 text-white"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}




