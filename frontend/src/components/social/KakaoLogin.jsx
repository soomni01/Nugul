import React, { useEffect } from "react";
import { Image } from "@chakra-ui/react";

// Kakao SDK 동적 로드 함수 추가
function loadKakaoSDK(kakaoRestKey) {
  return new Promise((resolve, reject) => {
    if (window.Kakao) {
      if (!window.Kakao.isInitialized()) {
        window.Kakao.init(kakaoRestKey);
      }
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://t1.kakaocdn.net/kakao_js_sdk/2.7.0/kakao.min.js";
    script.async = true;
    script.onload = () => {
      window.Kakao.init(kakaoRestKey);
      resolve(true);
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

export function KakaoLogin() {
  useEffect(() => {
    const kakaoRestKey = import.meta.env.VITE_KAKAO_REST_KEY;
    loadKakaoSDK(kakaoRestKey).catch((error) => {
      console.error("Kakao SDK 로드 실패:", error);
    });
  }, []);

  const handleKakaoLogin = () => {
    const redirectUri = "http://localhost:5173/oauth/kakao";
    const loginUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${import.meta.env.VITE_KAKAO_REST_KEY}&redirect_uri=${redirectUri}&response_type=code&prompt=login&scope=profile_nickname,profile_image,account_email`;
    window.location.href = loginUrl;
  };

  return (
    <>
      <Image
        boxSize="50px"
        onClick={handleKakaoLogin}
        src="../../../public/image/KakaoLogin.png"
        cursor="pointer"
      />
    </>
  );
}

// 카카오 회원 로그아웃 & 회원탈퇴
function kakaoApiRequest(endpoint) {
  return new Promise((resolve, reject) => {
    const kakaoRestKey = import.meta.env.VITE_KAKAO_REST_KEY;

    // SDK 로드 및 초기화 확인
    loadKakaoSDK(kakaoRestKey)
      .then(() => {
        const accessToken = sessionStorage.getItem("kakaoAccessToken"); // sessionStorage에서 액세스 토큰 가져오기
        if (!accessToken) {
          reject("카카오 액세스 토큰이 없습니다.");
          return;
        }

        // 카카오 API 호출
        fetch(`https://kapi.kakao.com/v1/user/${endpoint}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(`${endpoint} 요청 실패`);
            }
            return response.json();
          })
          .then((data) => {
            console.log(`${endpoint} 성공:`, data);

            // 성공적으로 처리된 후 액세스 토큰 삭제
            sessionStorage.removeItem("kakaoAccessToken");

            resolve(true); // 성공 처리
          })
          .catch((error) => {
            console.error(`${endpoint} 실패:`, error);
            reject(error);
          });
      })
      .catch((error) => {
        console.error("Kakao SDK 초기화 실패:", error);
        reject(error);
      });
  });
}

// 일반 로그아웃 처리 함수
export function kakaoLogout() {
  return kakaoApiRequest("logout");
}

// 회원 탈퇴 처리 함수 (카카오 계정 연결 해제)
export function kakaoUnlink() {
  return kakaoApiRequest("unlink");
}
