import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";
import { showError, showSuccess } from "../helpers/Swalfire";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!form.email || !form.password) {
      return showError("Missing Fields", "Please fill all fields");
    }
  
    try {
      const res = await loginUser(form); 
  
      console.log(res); 
      localStorage.setItem("user", JSON.stringify(res.user)); 
      localStorage.setItem("token", res.token);
  
      showSuccess("Login Successful", "Welcome back!");
      setForm({ email: "", password: "" });
      navigate("/dashboard");
    } catch (err) {
      console.error("Login Error: ", err); 
      showError("Login Failed", err.message || "Something went wrong");
    }
  };
  
  
  

  return (
    <div className="flex justify-center items-center min-h-screen bg-purple-100">
      <div className="w-[95%] md:max-w-4xl bg-white shadow-2xl rounded-xl flex overflow-hidden">
        {/* Left Side - Image */}
        <div className="w-1/2 hidden md:block bg-purple-100 p-0 m-0">
          <img
            src="/register.avif"
            alt="Login"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 bg-white p-10">
          <h2 className="text-3xl font-bold text-purple-700 mb-6 text-center">
            Login to Your Account
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-600">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full border-b-2 border-purple-400 bg-transparent py-3 px-4 focus:outline-none focus:border-purple-600 transition-all duration-300"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-600">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full border-b-2 border-purple-400 bg-transparent py-3 px-4 focus:outline-none focus:border-purple-600 transition-all duration-300"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded transition duration-300"
            >
              Login
            </button>

            <p className="mt-6 text-sm text-center text-gray-500">
              Don't have an account?{" "}
              <a href="/register" className="text-purple-600 hover:underline">
                Register here
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
