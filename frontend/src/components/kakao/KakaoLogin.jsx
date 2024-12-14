import React, { useEffect } from "react";
import { Button } from "../ui/button.jsx";
import { useNavigate } from "react-router-dom"; // 추가

export function KakaoLogin() {
  const navigate = useNavigate(); // 추가

  useEffect(() => {
    const kakaoRestKey = import.meta.env.VITE_KAKAO_REST_KEY;
    if (!window.Kakao.isInitialized()) {
      window.Kakao.init(kakaoRestKey);
    }
  }, []);

  const handleKakaoLogin = () => {
    const redirectUri = "http://localhost:5173/kakao/callback";
    const loginUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${import.meta.env.VITE_KAKAO_REST_KEY}&redirect_uri=${redirectUri}&response_type=code&prompt=login&scope=profile_nickname,profile_image,account_email`;
    window.location.href = loginUrl;
  };

  const handleKakaoLogout = () => {
    // Kakao SDK가 초기화되었는지 먼저 확인
    if (window.Kakao.isInitialized()) {
      window.Kakao.Auth.logout((response) => {
        if (response) {
          console.log("카카오 로그아웃 성공");
          // 로그아웃 후 홈 화면이나 로그인 페이지로 리디렉션
          navigate("/");
        } else {
          console.log("카카오 로그아웃 실패");
        }
      });
    } else {
      console.log("Kakao SDK가 초기화되지 않았습니다.");
    }
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
