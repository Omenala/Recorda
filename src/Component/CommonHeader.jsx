import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from React Router

function CommonHeader() {
  return (
    <>
      <nav className="navbar navbar-expand-lg border-bottom border-success">
        <div className="container">
          <a className="navbar-brand text-success" href="/">RECORDA<img src={'../src/assets/logo.png'} alt="logo" /></a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto" style={{ fontWeight: "900" }}>
              <li className="nav-item">
                <Link to="/register" className="nav-link border border-success rounded" aria-current="page">
                  SIGNUP
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/login" className="nav-link border border-success rounded ms-3">
                  LOGIN
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default CommonHeader;
