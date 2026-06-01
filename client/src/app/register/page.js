"use client";

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const RegisterPage = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/auth/signup", formData);

      toast.success(response.data.message);

      router.push("/login");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      {" "}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-6 border rounded-lg shadow"
      >
        {" "}
        <h1 className="text-2xl font-bold mb-6">Create Account </h1>
        ```
        <div className="mb-4">
          <label className="block mb-2">Name</label>

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border rounded p-2"
            placeholder="John Doe"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Email</label>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded p-2"
            placeholder="john@example.com"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block mb-2">Password</label>

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border rounded p-2"
            placeholder="********"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
