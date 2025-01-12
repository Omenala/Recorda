import React from "react";
import CommonHeader from "./CommonHeader";

const CommonLayout = ({ children }) => {
  return (
    <>
      <CommonHeader />
      <main>{children}</main>
    </>
  );
};

export default CommonLayout;
