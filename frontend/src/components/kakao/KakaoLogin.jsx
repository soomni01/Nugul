import React, { useEffect } from "react";
import { Button } from "../ui/button.jsx";

export function KakaoLogin() {
  useEffect(() => {
    const kakaoRestKey = import.meta.env.VITE_KAKAO_REST_KEY; // 환경 변수에서 REST API Key 가져오기
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init(kakaoRestKey);
    }
  }, []);

  const handleKakaoLogin = () => {
    const redirectUri = "http://localhost:5173/";
    Kakao.Auth.authorize({
      redirectUri: redirectUri,
    });

    window.Kakao.Auth.login({
      success: function (authObj) {
        // 로그인 성공 후 액세스 토큰을 가져옴
        console.log("카카오 로그인 성공", authObj);

        // 카카오 사용자 정보 요청
        window.Kakao.API.request({
          url: "/v2/user/me",
          success: function (res) {
            console.log("카카오 사용자 정보", res);

            // 여기서 받은 사용자 정보로 로그인 처리
            // 예시: 서버로 액세스 토큰을 보내거나 로컬에 저장
          },
          fail: function (error) {
            console.error("사용자 정보 가져오기 실패", error);
          },
        });
      },
      fail: function (err) {
        console.error("카카오 로그인 실패", err);
      },
    });
  };

  const handleKakaoLogout = () => {
    window.Kakao.Auth.logout(function () {
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
