import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Box } from "@chakra-ui/react";
import { toaster } from "../ui/toaster.jsx";
import { jwtDecode } from "jwt-decode";
import { AuthenticationContext } from "../context/AuthenticationProvider.jsx";

export function NaverOauth() {
  const navigate = useNavigate();
  const authentication = useContext(AuthenticationContext);

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
          // const token = data.token; // token 정보
          const redirectUrl = data.redirectUrl; // 리디렉션 URL
          const platform = data.platform;

          if (redirectUrl === "/main") {
            axios
              .post("/api/member/login", {
                memberId: member.memberId,
                password: null,
              })
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

  return <Box>로그인 처리 중...</Box>;
}
