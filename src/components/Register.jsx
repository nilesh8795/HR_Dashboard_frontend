import React, { useState } from "react";
import { registerUser } from "../services/api"; // adjust path as needed
import { showSuccess, showError } from "../helpers/Swalfire";
import { Link, useNavigate } from 'react-router-dom'


const RegisterForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (form.password !== confirmPassword) {
      showError("Oops...", "Passwords do not match!");
      return;
    }
  
    try {
      const res = await registerUser(form);
      console.log(res);
      
      showSuccess("Registered!", res.message);
      navigate('/')
      setForm({ name: "", email: "", password: "" });
      setConfirmPassword("");
    } catch (err) {
      showError("Registration Failed", err.response?.data?.message || "Something went wrong!");
    }
  };
  
  

  return (
    <div className="min-h-screen bg-purple-100 flex flex-col justify-center items-center p-4">
      <h1 className="text-4xl font-bold text-purple-800 mb-6">Register</h1>

      <div className="w-full max-w-5xl bg-white shadow-2xl rounded-lg flex overflow-hidden">
        {/* Image */}
        <div className="w-1/2 hidden md:flex justify-center items-center bg-purple-200">
          <img
            src="/register.avif"
            alt="Signup"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Form */}
        <div className="w-full md:w-1/2 bg-purple-900 text-white p-10">
          <h2 className="text-2xl font-bold text-purple-200 mb-6">
            Create an account
          </h2>

          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div className="mb-4">
              <label className="block text-sm mb-1 text-purple-300">
                Full Name
              </label>
              <div className="flex items-center border-b border-purple-500">
                <input
                  type="text"
                  name="name"
                  placeholder="Enter name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full bg-transparent text-white outline-none py-2 px-3 placeholder-purple-300"
                />
                <span className="text-purple-300 pr-2">👤</span>
              </div>
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-sm mb-1 text-purple-300">
                Email
              </label>
              <div className="flex items-center border-b border-purple-500">
                <input
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full bg-transparent text-white outline-none py-2 px-3 placeholder-purple-300"
                />
                <span className="text-purple-300 pr-2">📧</span>
              </div>
            </div>

            {/* Password */}
            <div className="mb-4">
              <label className="block text-sm mb-1 text-purple-300">
                Password
              </label>
              <div className="flex items-center border-b border-purple-500">
                <input
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full bg-transparent text-white outline-none py-2 px-3 placeholder-purple-300"
                />
                <span className="text-purple-300 pr-2">🔐</span>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="mb-6">
              <label className="block text-sm mb-1 text-purple-300">
                Confirm Password
              </label>
              <div className="flex items-center border-b border-purple-500 pb-2 bg-purple-900 focus-within:bg-purple-800 rounded">
                <input
                  type="password"
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-transparent text-white outline-none py-2 px-3 placeholder-purple-300"
                />
                <span className="text-purple-300 pr-2">🔒</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-purple-300 text-purple-900 font-semibold py-2 rounded hover:bg-purple-200 transition duration-300"
            >
              Register
            </button>

            <p className="mt-4 text-sm text-center">
              Already have an account?{" "}
              <Link to="/login" className="text-purple-300 underline">
                Login here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
