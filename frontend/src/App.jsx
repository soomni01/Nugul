import { createBrowserRouter, RouterProvider } from "react-router-dom";
import axios from "axios";
import { RootLayout } from "./page/root/RootLayout.jsx";
import { AdminLayout } from "./page/admin/AdminLayout.jsx";
import { AdminMemberList } from "./page/admin/AdminMemberList.jsx";
import { AdminMemberDetail } from "./page/admin/AdminMemberDetail.jsx";
import { AdminInquiryList } from "./page/admin/AdminInquiryList.jsx";
import { AdminInquiryDetail } from "./page/admin/AdminInquiryDetail.jsx";
import { MemberSignup } from "./page/member/MemberSignup.jsx";
import { MemberLogin } from "./page/member/MemberLogin.jsx";
import { ChatList } from "./page/chat/ChatList.jsx";
import { ProductList } from "./page/product/ProductList.jsx";
import { ProductShareList } from "./page/product/ProductShareList.jsx";
import { ProductAdd } from "./page/product/ProductAdd.jsx";
import { ProductView } from "./page/product/ProductView.jsx";
import { ProductEdit } from "./page/product/ProductEdit.jsx";
import { MainPage } from "./page/main/MainPage.jsx";
import { BoardList } from "./page/board/BoardList.jsx";
import { BoardAdd } from "./page/board/BoardAdd.jsx";
import { BoardView } from "./page/board/BoardView.jsx";
import { BoardEdit } from "./page/board/BoardEdit.jsx";
import { MyPage } from "./page/mypage/MyPage.jsx";
import ViewMap from "./page/map/ViewMap.jsx";
import AuthenticationProvider from "./components/context/AuthenticationProvider.jsx";
import { MemberSocial } from "./page/member/MemberSocial.jsx";
import { KakaoOauth } from "./components/social/KakaoOauth.jsx";
import { NaverOauth } from "./components/social/NaverOauth.jsx";
import { InquiryList } from "./page/inquiry/InquiryList.jsx";
import { InquiryView } from "./page/inquiry/InquiryView.jsx";
import { InquiryEdit } from "./page/inquiry/InquiryEdit.jsx";
import { Inquiry } from "./page/inquiry/Inquiry.jsx";
import "./fonts/index.css";
import ThemeProvider from "./components/context/ThemeProvider.jsx";

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
        element: <MemberLogin />,
      },
      {
        path: "main",
        element: <MainPage />,
      },
      {
        path: "member/signup",
        element: <MemberSignup />,
      },
      {
        path: "myPage",
        element: <MyPage />,
      },
      {
        path: "myPage/edit/:memberId",
        element: <MyPage />,
      },
      {
        path: "inquiry",
        element: <Inquiry />,
      },
      {
        path: "inquiry/myList",
        element: <InquiryList />,
      },
      {
        path: "/inquiry/myList/:inquiryId",
        element: <InquiryView />,
      },
      {
        path: "/inquiry/edit/:inquiryId",
        element: <InquiryEdit />,
      },
      {
        path: "chat",
        element: <ChatList />,
      },
      {
        path: "product/list",
        element: <ProductList />,
      },
      {
        path: "product/share/list",
        element: <ProductShareList />,
      },
      {
        path: "product/add",
        element: <ProductAdd />,
      },
      {
        path: "product/view/:productId",
        element: <ProductView />,
      },
      {
        path: "product/edit/:id",
        element: <ProductEdit />,
      },
      {
        path: "board/list",
        element: <BoardList />,
      },
      {
        path: "board/boardAdd",
        element: <BoardAdd />,
      },
      {
        path: "board/boardView/:boardId",
        element: <BoardView />,
      },
      {
        path: "board/boardEdit/:boardId",
        element: <BoardEdit />,
      },
      {
        path: "map",
        element: <ViewMap />,
      },
      {
        path: "oauth/kakao",
        element: <KakaoOauth />,
      },
      {
        path: "oauth/naver",
        element: <NaverOauth />,
      },
      {
        path: "member/social",
        element: <MemberSocial />,
      },
    ],
  },
  {
    path: "admin",
    element: <AdminLayout />,
    children: [
      {
        path: "members",
        element: <AdminMemberList />,
      },
      {
        path: "members/:memberId/detail",
        element: <AdminMemberDetail />,
      },
      {
        path: "inquiries",
        element: <AdminInquiryList />,
      },
      {
        path: "inquiries/:inquiryId",
        element: <AdminInquiryDetail />,
      },
    ],
  },
]);

function App() {
  return (
    <ThemeProvider>
      <AuthenticationProvider>
        <RouterProvider router={router} />
      </AuthenticationProvider>
    </ThemeProvider>
  );
}

export default App;
