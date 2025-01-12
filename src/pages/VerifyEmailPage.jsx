import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const VerifyEmailPage = () => {
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loading state for form submission
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setVerificationCode(e.target.value);
    if (error) setError(""); // Clear errors as the user types
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Simple validation
    if (!verificationCode || verificationCode.length !== 6) {
      setError("Please enter a valid 6-digit verification code.");
      return;
    }

    setIsLoading(true); // Show loading state

    try {
      const response = await fetch("http://127.0.0.1:8000/api/authent/verify-email/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: verificationCode }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("Email successfully verified!");
        setTimeout(() => {
          navigate("/login"); // Redirect to login page
        }, 2000);
      } else {
        setError(data.error || "Verification failed. Please try again.");
      }
    } catch (err) {
      console.error("Error during verification:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false); // Hide loading state
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true); // Show loading state for resend
    try {
      const response = await fetch("http://127.0.0.1:8000/api/authent/resend-email/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("Verification code resent successfully!");
      } else {
        setError(data.detail || "Failed to resend verification code.");
      }
    } catch (err) {
      console.error("Error during resend:", err);
      setError("An error occurred while resending the code.");
    } finally {
      setIsLoading(false); // Hide loading state
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Verify Your Email</h2>
      <form onSubmit={handleFormSubmit} className="p-4 m-auto shadow rounded" style={{ width: "400px" }}>
        {successMessage && <div className="alert alert-success">{successMessage}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="mb-3">
          <label className="form-label">Verification Code</label>
          <input
            type="text"
            name="verificationCode"
            value={verificationCode}
            onChange={handleInputChange}
            className={`form-control ${error ? "is-invalid" : ""}`}
          />
          {error && <div className="invalid-feedback">{error}</div>}
        </div>

        <button type="submit" className="btn btn-primary w-100 mb-3" disabled={isLoading}>
          {isLoading ? "Verifying..." : "Verify Email"}
        </button>

        <button
          type="button"
          className="btn btn-outline-secondary w-100"
          onClick={handleResendCode}
          disabled={isLoading}
        >
          {isLoading ? "Resending..." : "Resend Code"}
        </button>
      </form>
    </div>
  );
};

export default VerifyEmailPage;
