import axios from 'axios';

// Create an axios instance with a base URL
const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api",  // Replace with your API base URL
});

// Adding the token to the Authorization header automatically for every request
axiosInstance.interceptors.request.use(
  (config) => {
    // Get the token from localStorage
    const token = localStorage.getItem("token");
    if (token) {
      // Attach the token to the request header
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optionally, you can add a response interceptor to handle token expiration (401 Unauthorized)
axiosInstance.interceptors.response.use(
  (response) => response,  // If the response is successful, return it
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token");  // Clear the token
      window.location.href = "/login";   // Redirect to the login page
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
