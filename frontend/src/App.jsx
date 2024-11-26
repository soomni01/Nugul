import { createBrowserRouter, RouterProvider } from "react-router-dom";
import axios from "axios";
import { RootLayout } from "./page/root/RootLayout.jsx"; // 경로 수정
import { MainPage } from "./page/main/MainPage.jsx";
import AdminLayout from "./page/admin/AdminLayout.jsx";
import DashBoard from "./page/admin/DashBoard.jsx";
import MemberList from "./page/admin/MemberList.jsx"; // MemberList import
import ReportList from "./page/admin/ReportList.jsx"; // ReportList import

axios.interceptors.request.use(function (config) {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

const router = createBrowserRouter([
  {
    path: "/", // 기본 경로
    element: <RootLayout />, // 기본 레이아웃 (웹사이트의 메인 레이아웃)
    children: [
      {
        index: true, // 기본 페이지
        element: <MainPage />, // 메인 페이지 컴포넌트
      },
    ],
  },
  {
    path: "/admin", // /admin 경로
    element: <AdminLayout />, // AdminLayout을 적용
    children: [
      {
        index: true, // /admin 경로에서 기본 페이지 (대시보드)
        element: <DashBoard />,
      },
      {
        path: "members", // /admin/members 경로에서 사용자 관리 페이지
        element: <MemberList />,
      },
      {
        path: "reports", // /admin/reports 경로에서 신고 관리 페이지
        element: <ReportList />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
