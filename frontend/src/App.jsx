import { createBrowserRouter, RouterProvider } from "react-router-dom";
import axios from "axios";
import { RootLayout } from "./page/root/RootLayout.jsx";
import { MainPage } from "./page/main/MainPage.jsx";
import { ProductList } from "./page/product/ProductList.jsx";
import { ProductAdd } from "./page/product/ProductAdd.jsx";

axios.interceptors.request.use(function (config) {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <MainPage />,
      },
      {
        path: "product/list",
        element: <ProductList />,
      },
      {
        path: "product/add",
        element: <ProductAdd />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
