import React,{useEffect} from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import LandList from "./pages/LandList";
import TransactionList from "./pages/TransactionList";
import ErrorBoundary from "./Component/ErrorBoundary";
import LandUpload from "./pages/LandUpload";
import TransactionUpload from "./pages/TransactionUpload";
import Footer from "./Component/Footer";
import TransactionReceipt from "./pages/TransactionReceipt";
import TransactionHistory from "./pages/TransactionHistory";
import LocationFilterPage from "./pages/LocationFilterPage";
import RegistrationForm from "./pages/RegistrationForm";
import LoginForm from "./pages/LoginForm";
import VerifyEmailPage from "./pages/VerifyEmailPage";
//import LocationFilterPage from "./pages/LocationFilterPage";
import AOS from 'aos';
import "./App.css";

// Headers for Different Pages
import CommonHeader from "./Component/CommonHeader"; // For Home, Registration, Login
import DefaultHeader from "./Component/DefaultHeader"; // For other pages

function App() {
  useEffect(() => {
    AOS.init({
      duration:2000,
      once: true
  });
  }, [])
  return (
<Router>
      <div className="d-flex flex-column min-vh-100">
        <Routes>
          {/* Common Header Routes */}
          <Route
            path="/"
            element={
              <>
                <CommonHeader />
                <main className="flex-grow-1">
                  <Home />
                </main>
                <Footer />
              </>
            }
          />
          <Route
            path="/register"
            element={
              <>
                <CommonHeader />
                <main className="flex-grow-1">
                  <RegistrationForm />
                </main>
                <Footer />
              </>
            }
          />

         <Route
            path="/verify"
            element={
              <>
                <CommonHeader />
                <main className="flex-grow-1">
                  <VerifyEmailPage />
                </main>
                <Footer />
              </>
            }
          />

          <Route
            path="/login"
            element={
              <>
                <CommonHeader />
                <main className="flex-grow-1">
                  <LoginForm />
                </main>
                <Footer />
              </>
            }
          />

          {/* Dashboard Header Routes */}
          <Route
            path="/locations"
            element={
              <>
                <DefaultHeader />
                <main className="flex-grow-1">
                  <LocationFilterPage />
                </main>
                <Footer />
              </>
            }
          />


          <Route
            path="/lands/:location"
            element={
              <>
                <DefaultHeader />
                <main className="flex-grow-1">
                  <LandList />
                </main>
                <Footer />
              </>
            }
          />
          
          <Route
            path="/lands/upload"
            element={
              <>
                <DefaultHeader />
                <main className="flex-grow-1">
                  <LandUpload />
                </main>
                <Footer />
              </>
            }
          />

          <Route
            path="/transaction/upload"
            element={
              <>
                <DefaultHeader />
                <main className="flex-grow-1">
                  <TransactionUpload/>
                </main>
                <Footer />
              </>
            }
          />

         <Route
            path="/transaction/list"
            element={
              <>
                <DefaultHeader />
                <main className="flex-grow-1">
                  <TransactionList/>
                </main>
                <Footer />
              </>
            }
          />

           <Route
            path="/transactions/:landId"
            element={
              <>
                <DefaultHeader />
                <main className="flex-grow-1">
                  <TransactionHistory/>
                </main>
                <Footer />
              </>
            }
          />
          <Route
            path="/transaction/:transaction_Id"
            element={
              <>
                <DefaultHeader />
                <main className="flex-grow-1">
                  <TransactionReceipt />
                </main>
                <Footer />
              </>
            }
          />

          {/* Default Route */}
          <Route
            path="*"
            element={
              <>
                <CommonHeader />
                <main className="flex-grow-1">
                  <Home />
                </main>
                <Footer />
              </>
            }
          />
        </Routes>
      </div>
    </Router>
     );
}

export default App;
