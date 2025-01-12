import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const RegistrationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    let formErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10,15}$/;
    ///const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@.])[A-Za-z\d@.]{8,}$/;
    const passwordRegex = /^(?=.*[A-Za-z0-9]).{8,}$/;

    if (!formData.firstName.trim()) formErrors.firstName = "First name is required.";
    if (!formData.email || !emailRegex.test(formData.email)) formErrors.email = "Valid email is required.";
    if (!formData.phone || !phoneRegex.test(formData.phone)) formErrors.phone = "Valid phone number is required (10-15 digits).";
    if (!formData.role.trim()) formErrors.role = "Role is required.";
    if (!formData.password || !passwordRegex.test(formData.password))
      formErrors.password = "Password must be at least 8 characters long, include a number, and contain '@' or '.'.";
    if (formData.password !== formData.confirmPassword)
      formErrors.confirmPassword = "Passwords do not match.";

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      try {
        const response = await fetch("http://127.0.0.1:8000/api/authent/register/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            role_in_the_company: formData.role,
            password: formData.password,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          alert("Registration successful!");
          navigate("/verify");
        } else {
          setErrors(data);
          alert("Registration failed. Please check your details.");
        }
      } catch (error) {
        console.error("Error during registration:", error);
        alert("An error occurred. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleGoogleSignUp = () => {
    console.log("Google Sign-Up clicked");
    // Add Google Sign-Up logic here
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Register</h2>
      <form className="row justify-content-center" onSubmit={handleFormSubmit}>
        <div className="col-12 col-md-6 p-4 shadow-sm rounded">
          {/* Form Fields */}
          {[
            { name: "firstName", label: "First Name", type: "text" },
            { name: "lastName", label: "Last Name", type: "text" },
            { name: "email", label: "Email", type: "email" },
            { name: "phone", label: "Phone", type: "tel" },
            { name: "role", label: "Role in Company", type: "text" },
          ].map(({ name, label, type }) => (
            <div className="mb-3" key={name}>
              <label className="form-label">{label}</label>
              <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleInputChange}
                className={`form-control ${errors[name] ? "is-invalid" : ""}`}
              />
              {errors[name] && <div className="invalid-feedback">{errors[name]}</div>}
            </div>
          ))}

          {/* Password Field */}
          <div className="mb-3">
            <label className="form-label">Password</label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
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
            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
          </div>

          {/* Confirm Password */}
          <div className="mb-3">
            <label className="form-label">Confirm Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
            />
            {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn btn-success w-100 mb-3" disabled={isLoading}>
            {isLoading ? "Registering..." : "Sign Up"}
          </button>

          {/* Google Sign-Up */}
          <button
            type="button"
            className="btn btn-light w-100 mb-3 d-flex align-items-center justify-content-center"
            onClick={handleGoogleSignUp}
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
              alt="Google Logo"
              className="me-2"
              style={{ width: "20px", height: "20px" }}
            />
            Sign Up with Google
          </button>

          <div className="text-center">
            <p>
              Already have an account? <a href="/login">Login</a>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default RegistrationForm;
