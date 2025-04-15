import { useRoutes } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ProductList from "../pages/ProductList";
import TwoFAVerify from "../pages/2FAVerify";
import ResetPassword from "../pages/ResetPassword";
import ForgotPassword from "../pages/ForgotPassword";
import Profile from "../pages/Profile";
import Navbar from "../components/Navbar";

const AppRoutes = () => {
  const routes = [
    { path: "/", element: <Home /> },
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
    { path: "/products", element: <ProductList /> },
    { path: "/verify-2fa", element: <TwoFAVerify /> },
    { path: "/reset-password", element: <ResetPassword /> },
    { path: "/forgot-password", element: <ForgotPassword /> },
    { path: "/profile", element: <Profile /> },
  ];

  return (
    <>
      <Navbar />
      {useRoutes(routes)};
    </>
  );
};

export default AppRoutes;
