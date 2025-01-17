import React from "react";

import GlobalSearch from "./GlobalSearch";

import UserInfo from "./UserInfo";





const DefaultHeader = () => {

  const userName = "User"; // Replace this with dynamic user data.

  const profilePicture =

    "https://via.placeholder.com/40"; // Replace with dynamic profile picture URL.



  return (

    <header className="bg-success text-white py-2">

      <div className="container d-flex align-items-center justify-content-between">

        {/* Logo */}

        <div className="d-flex align-items-center">

        <a className="navbar-brand font-" href="/">REKORDA</a>

        </div>



        <GlobalSearch></GlobalSearch>



        <UserInfo></UserInfo>

      </div>

    </header>

  );

};



export default DefaultHeader; 