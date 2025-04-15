import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { ToastContainer } from "react-toastify";
export const App = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
      <ToastContainer position="top-center" autoClose={2000} />
    </BrowserRouter>
  );
};
