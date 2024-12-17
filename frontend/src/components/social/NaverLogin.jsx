import React from "react";
import { Image } from "@chakra-ui/react";
import axios from "axios";

export function NaverLogin() {
  const NAVER_CLIENT_ID = import.meta.env.VITE_NAVER_CLIENT_KEY;
  const REDIRECT_URI = "http://localhost:5173/oauth/naver";
  const STATE = Math.random().toString(36).substring(2);
  const NAVER_AUTH_URL = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&state=${STATE}&redirect_uri=${REDIRECT_URI}&autoLogin=false&forceLogin=true`;

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

export async function naverUnlink() {
  const accessToken = sessionStorage.getItem("naverAccessToken");

  try {
    // 백엔드로 연동 해제 요청
    const response = await axios.post("/api/member/naver/unlink", {
      accessToken,
    });

    // 서버로부터 받은 성공 메시지
    return response.data;
  } catch (error) {
    console.error("연동 해제 실패:", error);
    throw error;
  }
}
