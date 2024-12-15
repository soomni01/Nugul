import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Box } from "@chakra-ui/react";
import { toaster } from "../ui/toaster.jsx";
import { jwtDecode } from "jwt-decode";
import { AuthenticationContext } from "../../components/context/AuthenticationProvider.jsx";

export function KakaoOauth() {
  const navigate = useNavigate();
  const authentication = useContext(AuthenticationContext);

  // URL에서 인가 코드 추출
  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");

    // 카카오 서버로 토큰 요청
    if (code) {
      requestKakaoToken(code);
    }
  }, []);

  // 카카오 서버로 토큰 요청
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
          redirect_uri: "http://localhost:5173/oauth",
          code: code,
        }),
      });

      const data = await response.json();
      console.log("카카오 토큰 응답:", data);

      // 액세스 토큰으로 사용자 정보 가져오기
      if (data.access_token) {
        // 세션 스토리지에 카카오 액세스 토큰 저장
        sessionStorage.setItem("kakaoAccessToken", data.access_token);

        fetchKakaoUserInfo(data.access_token);
      }
    } catch (error) {
      console.error("토큰 요청 중 에러:", error);
    }
  };

  // 카카오 사용자 정보 가져오기
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
      const kakaoEmail = userData.kakao_account?.email || "이메일 없음";
      const kakaoNickname =
        userData.kakao_account?.profile?.nickname || "닉네임 없음";
      const kakaoProfileImage =
        userData.kakao_account?.profile?.profile_image_url ||
        "프로필 이미지 없음";

      // 서버에서 이메일 존재 여부 확인
      if (kakaoEmail) {
        const checkEmailResponse = await axios.get("/api/member/check-email", {
          params: { email: kakaoEmail },
        });

        console.log(checkEmailResponse.data);
        if (checkEmailResponse.data) {
          console.log("토큰");
          // 기존 회원 → main 페이지로 이동
          axios
            .post("/api/member/login", { memberId: kakaoEmail, password: null })
            .then((res) => res.data)
            .then((data) => {
              console.log(data);
              toaster.create({
                type: data.message.type,
                description: data.message.text,
              });
              const decodedToken = jwtDecode(data.token);
              const userScope = decodedToken.scope || "";

              if (userScope === "admin") {
                navigate("/admin/dashboard");
              } else {
                navigate("/main");
              }
              authentication.login(data.token);
            })
            .catch((e) => {
              const message = e.response?.data?.message || {
                type: "error",
                text: "알 수 없는 오류가 발생했습니다.",
              };

              toaster.create({
                type: message.type,
                description: message.text,
              });
            });
        } else {
          // 신규 회원 → 추가 정보 입력 페이지로 이동
          console.log(kakaoEmail, kakaoNickname, kakaoProfileImage);
          navigate("/kakao/callback", {
            state: {
              email: kakaoEmail,
              nickname: kakaoNickname,
              profileImage: kakaoProfileImage,
            },
          });
        }
      }
    } catch (error) {
      console.error("사용자 정보 요청 중 에러:", error);
    }
  };

  return <Box>카카오 로그인 후 처리 중...</Box>;
}
