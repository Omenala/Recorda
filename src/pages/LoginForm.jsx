import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    let formErrors = {};
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^(?=.*[A-Za-z0-9]).{8,}$/;

    if (!formData.email || !emailRegex.test(formData.email))
      formErrors.email = "Valid email is required.";
    if (!formData.password || !passwordRegex.test(formData.password))
      formErrors.password =
        "Password must be at least 8 characters long and include a number.";

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const payload = {
        email: formData.email,
        password: formData.password,
      };

      axios
        .post("https://recordabackend.onrender.com/api/authent/login/", payload)
        .then((response) => {
          const { token } = response.data;
          localStorage.setItem("auth_token", token);
          navigate("/locations");
        })
        .catch((error) => {
          setErrors({ form: "Invalid email or password" });
        });
    }
  };

  const handleGoogleLogin = () => {
    console.log("Google Login clicked");
  };

  return (
    <div
      className="container d-flex justify-content-center align-items-center mt-4"
      style={{ minHeight: "100vh" }}
    >
      <form
        onSubmit={handleFormSubmit}
        className="p-4 shadow rounded bg-white"
        style={{
          maxWidth: "400px",
          width: "100%",
        }}
      >
        <h2 className="text-center mb-4">Login</h2>

        {/* Email Input */}
        <div className="mb-3">
          <label className="form-label" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`form-control ${errors.email ? "is-invalid" : ""}`}
          />
          {errors.email && <div className="invalid-feedback">{errors.email}</div>}
        </div>

        {/* Password Input */}
        <div className="mb-3">
          <label className="form-label" htmlFor="password">
            Password
          </label>
          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`form-control ${errors.password ? "is-invalid" : ""}`}
            />
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.password && (
            <div className="invalid-feedback">{errors.password}</div>
          )}
        </div>

        {/* Error Message */}
        {errors.form && <div className="alert alert-danger">{errors.form}</div>}

        {/* Login Button */}
        <button type="submit" className="btn btn-success w-100 mb-3">
          Login
        </button>

        {/* Google Login */}
        <button
          type="button"
          className="btn btn-outline-primary w-100 mb-3"
          onClick={handleGoogleLogin}
        >
          Login with Google
        </button>

        {/* Redirect to Signup */}
        <div className="text-center">
          <p className="mb-0">
            Don't have an account? <a href="/register">Sign up</a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
