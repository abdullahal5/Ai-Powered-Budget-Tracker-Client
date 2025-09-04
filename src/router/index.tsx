import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import HomePage from "../pages/HomePage";
import Dashboard from "../pages/dashboard/Dashboard";
import AccountDetails from "../pages/dashboard/Account";
import CreateTransaction from "../pages/dashboard/CreateTransaction";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "",
        element: <HomePage />,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/dashboard/account/:id",
        element: <AccountDetails />,
      },
      {
        path: "/dashboard/transaction/create",
        element: <CreateTransaction />,
      },
    ],
  },
]);

export default router;
