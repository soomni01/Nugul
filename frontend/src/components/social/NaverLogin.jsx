import React from "react";
import { Image } from "@chakra-ui/react";
import axios from "axios";

export function NaverLogin() {
  const NAVER_CLIENT_ID = import.meta.env.VITE_NAVER_CLIENT_KEY;
  const REDIRECT_URI = "http://localhost:5173/oauth/naver";
  const STATE = Math.random().toString(36).substring(2);
  const NAVER_AUTH_URL = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&state=${STATE}&redirect_uri=${REDIRECT_URI}&autoLogin=false`;

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

// 네이버 계정 연동 해제 함수
export async function naverUnlink() {
  try {
    const accessToken = sessionStorage.getItem("naverAccessToken");

    if (!accessToken) {
      throw new Error("네이버 액세스 토큰이 존재하지 않습니다.");
    }

    const response = await axios.post(
      "https://apis.naver.com/nidlogin.logout", // 네이버 연동 해제 API 엔드포인트
      null, // Body는 필요 없으므로 null로 설정
      {
        headers: {
          Authorization: `Bearer ${accessToken}`, // 액세스 토큰을 Authorization 헤더에 포함
        },
      },
    );

    if (response.status === 200) {
      console.log("네이버 계정 연동 해제 성공");
    } else {
      console.error("네이버 연동 해제 실패:", response.data);
      throw new Error("네이버 연동 해제 실패");
    }
  } catch (error) {
    console.error("네이버 계정 연동 해제 중 오류 발생:", error);
    throw error; // 오류가 발생하면 상위에서 처리하도록 전달
  }
}
