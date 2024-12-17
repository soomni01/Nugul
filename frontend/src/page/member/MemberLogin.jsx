import { Box, Input, Stack, Text } from "@chakra-ui/react";
import { Field } from "../../components/ui/field.jsx";
import { useContext, useState } from "react";
import { Button } from "../../components/ui/button.jsx";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toaster } from "../../components/ui/toaster.jsx";
import { jwtDecode } from "jwt-decode";
import { PasswordInput } from "../../components/ui/password-input.jsx";
import { AuthenticationContext } from "../../components/context/AuthenticationProvider.jsx";
import { KakaoLogin } from "../../components/kakao/KakaoLogin.jsx";

export function MemberLogin() {
  const [memberId, setMemberId] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const authentication = useContext(AuthenticationContext);

  const NAVER_CLIENT_ID = import.meta.env.VITE_NAVER_CLIENT_KEY;
  const REDIRECT_URI = "http://localhost:5173/naver/oauth";
  const STATE = Math.random().toString(36).substring(2);
  const NAVER_AUTH_URL = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&state=${STATE}&redirect_uri=${REDIRECT_URI}&auth_type=reprompt`;

  const NaverLogin = () => {
    window.location.replace(NAVER_AUTH_URL);
  };

  const handleLoginClick = () => {
    let isValid = true;

    setErrorMessage("");

    if (!memberId && !password) {
      isValid = false;
      toaster.create({
        type: "error",
        description: "이메일과 비밀번호를 입력해 주세요.",
      });
    } else if (!memberId) {
      isValid = false;
      toaster.create({
        type: "error",
        description: "이메일을 입력해 주세요.",
      });
    } else if (!password) {
      isValid = false;
      toaster.create({
        type: "error",
        description: "비밀번호를 입력해 주세요.",
      });
    }

    if (!isValid) {
      return;
    }

    axios
      .post("/api/member/login", { memberId, password })
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
        // localStorage.setItem("token", data.token);
      })
      .catch((e) => {
        const message = e.response?.data?.message || {
          type: "error",
          text: "알 수 없는 오류가 발생했습니다.",
        };

        if (
          message.text.includes("이메일") ||
          message.text.includes("비밀번호")
        ) {
        } else {
          setErrorMessage("알 수 없는 오류가 발생했습니다.");
        }

        toaster.create({
          type: message.type,
          description: message.text,
        });
      });
  };

  const NaverLogout = () => {
    // 네이버 로그아웃 URL
    const logoutUrl = "https://nid.naver.com/nidlogin.logout";

    // 네이버 로그아웃 후 리디렉션할 URL 설정 (로그아웃 후 사용자가 돌아갈 URL)
    const redirectUri = "http://localhost:5173/signup"; // 본인의 리디렉션 URL로 설정

    // 로그아웃을 위한 URL
    const logoutRedirectUrl = `${logoutUrl}?url=${encodeURIComponent(redirectUri)}`;

    // 네이버 로그아웃 후 지정된 페이지로 리디렉션
    window.location.href = logoutRedirectUrl;
  };

  return (
    <Box>
      <Text fontSize="2xl" fontWeight="bold" mb={5} m={2}>
        로그인
      </Text>
      <Stack gap={5}>
        <Field>
          <Input
            placeholder="이메일"
            value={memberId}
            onChange={(e) => setMemberId(e.target.value)}
          />
        </Field>

        <Field>
          <PasswordInput
            placeholder="비밀번호 입력"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field>

        <Box display="flex" gap={2}>
          <Button onClick={handleLoginClick}>로그인</Button>
        </Box>

        <Box display="flex" justifyContent="center" mt={4}>
          <KakaoLogin />
        </Box>

        <Button onClick={NaverLogin}>네이버 로그인</Button>
        <Button onClick={NaverLogout}>네이버 로그아웃</Button>

        <Box textAlign="center" mt={4}>
          아직 계정이 없으신가요?{" "}
          <Link
            to="/member/signup"
            style={{ color: "blue", textDecoration: "underline" }}
          >
            회원가입
          </Link>
        </Box>
      </Stack>
    </Box>
  );
}
