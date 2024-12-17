import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export function NaverOauth() {
  const navigate = useNavigate();

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");
    const state = new URL(window.location.href).searchParams.get("state");

    if (code) {
      // 백엔드에 code와 state를 전송하여 사용자 정보 요청
      axios
        .post("/api/member/naver/oauth", { code, state })
        .then((response) => {
          const data = response.data;

          // 서버에서 받은 정보
          const member = data.member; // member 정보
          const token = data.token; // token 정보
          const redirectUrl = data.redirectUrl; // 리디렉션 URL
          const platform = data.platform;

          if (redirectUrl === "/main") {
            // 이미 회원인 경우
            console.log("로그인 성공:", member); // member 정보 사용
            navigate(redirectUrl, {
              state: {
                email: member.memberId,
                nickname: member.nickname,
                profileImage: member.profileImage,
                platform,
              },
            });
          } else if (redirectUrl === "/member/social") {
            // 회원가입이 필요한 경우
            console.log("회원가입 필요:", member); // member 정보 사용
            navigate(redirectUrl, {
              state: {
                email: member.memberId,
                nickname: member.nickname,
                profileImage: member.profileImage,
                platform,
              },
            });
          }
        })
        .catch((error) => {
          console.error("로그인 실패:", error);
        });
    }
  }, [navigate]);

  return <div>로그인 처리 중...</div>;
}
