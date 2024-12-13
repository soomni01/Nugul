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
    // window.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${import.meta.env.VITE_KAKAO_REST_KEY}&redirect_uri=${redirectUri}&response_type=code`;

    // 우선 테스트용으로 자동 로그인 막고 프로필 선택 창 무조건 뜨게 설정
    const loginUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${import.meta.env.VITE_KAKAO_REST_KEY}&redirect_uri=${redirectUri}&response_type=code&prompt=login&scope=profile_nickname,profile_image,account_email`;
    window.location.href = loginUrl;
  };

  const handleKakaoLogout = () => {
    // Kakao SDK가 초기화되었는지 먼저 확인
    if (window.Kakao.isInitialized()) {
      window.Kakao.Auth.logout((response) => {
        if (response) {
          // 로그아웃 성공 시
          console.log("카카오 로그아웃 성공");
          // 필요하다면 여기서 추가 로직 수행 (예: 페이지 리디렉션)
        } else {
          // 로그아웃 실패 시
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
