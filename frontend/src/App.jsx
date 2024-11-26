import axios from "axios";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { RootLayout } from "./components/root/RootLayout.jsx";

axios.interceptors.request.use(function (config) {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

function MainPage() {
  return <div> 메인 페이지</div>;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <MainPage />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
