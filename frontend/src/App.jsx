import { createBrowserRouter, RouterProvider } from "react-router-dom";
import axios from "axios";
import { RootLayout } from "./page/root/RootRayout.jsx";
import { MainPage } from "./page/main/MainPage.jsx";
import { MemberSignup } from "./page/member/MemberSignup.jsx";
import { MemberList } from "./page/member/MemberList.jsx";

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
        path: "member/signup",
        element: <MemberSignup />,
      },
      {
        path: "member/list",
        element: <MemberList />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
