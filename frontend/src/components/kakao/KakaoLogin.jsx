// KakaoLogin 컴포넌트
import React, { useEffect } from "react";
import { Button } from "../ui/button.jsx";

export function KakaoLogin() {
  useEffect(() => {
    const kakaoRestKey = import.meta.env.VITE_KAKAO_REST_KEY;
    if (!window.Kakao.isInitialized()) {
      window.Kakao.init(kakaoRestKey);
    }
  }, []);

  const handleKakaoLogin = () => {
    const redirectUri = "http://localhost:5173/kakao/callback";
    window.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${import.meta.env.VITE_KAKAO_REST_KEY}&redirect_uri=${redirectUri}&response_type=code`;
  };

  const handleKakaoLogout = () => {
    window.Kakao.Auth.logout(() => {
      console.log("로그아웃 완료");
    });
  };

  return (
    <>
      <Button onClick={handleKakaoLogin} colorScheme="yellow" variant="outline">
        카카오로 로그인
      </Button>
      <Button onClick={handleKakaoLogout}>카카오 로그아웃</Button>
    </>
  );
}
