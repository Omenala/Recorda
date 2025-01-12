import React from "react";
import DefaultHeader from "./DefaultHeader";

const DefaultLayout = ({ children }) => {
  return (
    <>
      <DefaultHeader />
      <main>{children}</main>
    </>
  );
};

export default DefaultLayout;
