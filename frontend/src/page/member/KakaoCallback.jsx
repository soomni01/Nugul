import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function KakaoCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // URL에서 인가 코드 추출
    const code = new URL(window.location.href).searchParams.get("code");

    if (code) {
      // 카카오 서버로 토큰 요청
      requestKakaoToken(code);
    }
  }, []);

  const requestKakaoToken = async (code) => {
    try {
      const response = await fetch("https://kauth.kakao.com/oauth/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          client_id: import.meta.env.VITE_KAKAO_REST_KEY,
          redirect_uri: "http://localhost:5173/kakao/callback",
          code: code,
        }),
      });

      const data = await response.json();
      console.log("카카오 토큰 응답:", data);

      // 액세스 토큰으로 사용자 정보 가져오기
      if (data.access_token) {
        fetchKakaoUserInfo(data.access_token);
      }
    } catch (error) {
      console.error("토큰 요청 중 에러:", error);
    }
  };

  const fetchKakaoUserInfo = async (accessToken) => {
    try {
      const response = await fetch("https://kapi.kakao.com/v2/user/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const userData = await response.json();
      console.log("카카오 사용자 정보:", userData);

      // 여기서 사용자 정보로 로그인 처리 등을 할 수 있습니다.
      // 예: 백엔드 서버로 토큰 및 사용자 정보 전송
    } catch (error) {
      console.error("사용자 정보 요청 중 에러:", error);
    }
  };

  return <div>카카오 로그인 처리 중...</div>;
}
