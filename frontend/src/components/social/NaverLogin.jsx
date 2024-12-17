import React from "react";
import { Image } from "@chakra-ui/react";

export function NaverLogin() {
  const NAVER_CLIENT_ID = import.meta.env.VITE_NAVER_CLIENT_KEY;
  const REDIRECT_URI = "http://localhost:5173/oauth/naver";
  const STATE = Math.random().toString(36).substring(2);
  const NAVER_AUTH_URL = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&state=${STATE}&redirect_uri=${REDIRECT_URI}&auth_type=reprompt`;

  const handleNaverLogin = () => {
    window.location.replace(NAVER_AUTH_URL);
  };

  return (
    <>
      <Image
        size="10%"
        onClick={handleNaverLogin}
        src="../../../public/image/NaverButton.png"
        cursor="pointer"
      />
    </>
  );
}

// 네이버 로그아웃 & 회원탈퇴 처리
// export const NaverLogout = () => {
//   // 네이버 로그아웃 URL
//   const logoutUrl = "https://nid.naver.com/nidlogin.logout";
//
//   // 네이버 로그아웃 후 리디렉션할 URL 설정 (로그아웃 후 사용자가 돌아갈 URL)
//   const redirectUri = "http://localhost:5173/signup"; // 본인의 리디렉션 URL로 설정
//
//   // 로그아웃을 위한 URL
//   const logoutRedirectUrl = `${logoutUrl}?url=${encodeURIComponent(redirectUri)}`;
//
//   // 네이버 로그아웃 후 지정된 페이지로 리디렉션
//   window.location.href = logoutRedirectUrl;
// };