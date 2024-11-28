import { createBrowserRouter, RouterProvider } from "react-router-dom";
import axios from "axios";
import { RootLayout } from "./page/root/RootLayout.jsx";
import { MainPage } from "./page/main/MainPage.jsx";
import AdminLayout from "./page/admin/AdminLayout.jsx";
import AdminDashBoard from "./page/admin/AdminDashBoard.jsx";
import { AdminMemberList } from "./page/admin/AdminMemberList.jsx";
import { AdminReportList } from "./page/admin/AdminReportList.jsx";

// Axios 인터셉터 설정
axios.interceptors.request.use(function (config) {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 관리자 여부에 따라 기본 경로 변경 로직
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element:
          localStorage.getItem("userRole") === "admin" ? (
            <AdminDashBoard /> // 관리자는 대시보드 페이지로
          ) : (
            <MainPage /> // 일반 사용자는 메인 페이지로
          ),
      },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        path: "dashboard",
        element: <AdminDashBoard />,
      },
      {
        path: "members",
        element: <AdminMemberList />,
      },
      {
        path: "reports",
        element: <AdminReportList />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
