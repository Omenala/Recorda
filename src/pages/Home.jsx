import React from 'react';
import pics from '../assets/pics.png';

function Home() {
  return (
    <div
      className="container d-flex flex-column flex-md-row align-items-center"
      style={{ marginTop: '100px', padding: '20px' }}
    >
      {/* Text Section */}
      <div
        className="title text-center text-md-start"
        data-aos="fade-right"
        style={{ flex: 1, marginBottom: '20px' }}
      >
        <h1
          className="fw-bold"
          style={{ fontSize: '28px', lineHeight: '1.5', marginBottom: '20px' }}
        >
          Smart Record Keeping Made Easy
        </h1>
        <p style={{ fontSize: '18px', lineHeight: '1.6', marginBottom: '20px' }}>
          Simplify your business operations with our innovative record-keeping app.
          Designed for seamless tracking of transactions, inventory, and customer details,
          it empowers you to manage data efficiently. Whether you're a small business
          owner or part of a larger enterprise, our app ensures accuracy, organization,
          and accessibility—all in one intuitive platform.
        </p>
        <div
          className="btn btn-outline-success w-100 w-md-auto"
          data-aos="fade-right"
        >
          Learn More
        </div>
      </div>

      {/* Image Section */}
      <div className="imag" data-aos="fade-left" style={{ flex: 1 }}>
        <img
          src={pics}
          alt="Smart Record Keeping"
          className="img-fluid"
          style={{
            maxWidth: '100%',
            height: 'auto',
            borderRadius: '10px',
            marginLeft:"50px"
          }}
        />
      </div>
    </div>
  );
}

export default Home;
