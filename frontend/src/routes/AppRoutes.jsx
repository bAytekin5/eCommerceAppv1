import { useRoutes } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ProductList from "../pages/product/ProductList";
import TwoFAVerify from "../pages/auth/2FAVerify";
import ResetPassword from "../pages/auth/ResetPassword";
import ForgotPassword from "../pages/auth/ForgotPassword";
import Profile from "../pages/Profile";
import Navbar from "../components/Navbar";
import Cart from "../pages/Cart";
import ProductCreate from "../pages/product/ProductCreate";
import ProductEdit from "../pages/product/ProductEdit";
import CategoryManage from "../pages/categories/CategoryManage";

const AppRoutes = () => {
  const routes = [
    { path: "/", element: <Home /> },

    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
    { path: "/reset-password", element: <ResetPassword /> },
    { path: "/forgot-password", element: <ForgotPassword /> },
    { path: "/verify-2fa", element: <TwoFAVerify /> },

    { path: "/profile", element: <Profile /> },

    { path: "/products", element: <ProductList /> },
    { path: "/cart", element: <Cart /> },
    { path: "/products/create", element: <ProductCreate /> },
    { path: "/products/:id/edit", element: <ProductEdit /> },
    { path: "/categories/manage", element: <CategoryManage /> },
  ];

  return (
    <>
      <Navbar />
      {useRoutes(routes)};
    </>
  );
};

export default AppRoutes;
