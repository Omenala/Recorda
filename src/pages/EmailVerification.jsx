import React, { useState } from "react";

const EmailVerification = () => {
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [resendMessage, setResendMessage] = useState("");
  const [isResending, setIsResending] = useState(false);

  const validateCode = () => {
    if (verificationCode.trim().length !== 6 || isNaN(verificationCode)) {
      setError("Verification code must be a 6-digit number.");
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (validateCode()) {
      // Simulate API request for verification
      console.log("Verifying code:", verificationCode);
      setTimeout(() => {
        if (verificationCode === "123456") {
          setSuccessMessage("Email verified successfully!");
        } else {
          setError("Invalid verification code. Please try again.");
        }
      }, 1000);
    }
  };

  const handleResendCode = () => {
    setIsResending(true);
    setResendMessage("");
    setTimeout(() => {
      console.log("Resending verification code...");
      setIsResending(false);
      setResendMessage("Verification code has been resent to your email.");
    }, 2000);
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow p-4">
            <h2 className="text-center mb-4">Email Verification</h2>
            <p className="text-muted text-center">
              Enter the 6-digit code sent to your email to verify your account.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Verification Code</label>
                <input
                  type="text"
                  className={`form-control ${error ? "is-invalid" : ""}`}
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  maxLength="6"
                />
                {error && <div className="invalid-feedback">{error}</div>}
              </div>

              <button type="submit" className="btn btn-primary w-100 mb-3">
                Verify Email
              </button>

              {successMessage && (
                <div className="alert alert-success text-center">
                  {successMessage}
                </div>
              )}
            </form>

            <div className="text-center">
              <button
                type="button"
                className="btn btn-link"
                onClick={handleResendCode}
                disabled={isResending}
              >
                {isResending ? "Resending..." : "Resend Code"}
              </button>
              {resendMessage && (
                <div className="text-success mt-2">{resendMessage}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
