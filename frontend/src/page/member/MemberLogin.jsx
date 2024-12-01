import { Box, Input, Stack, Text } from "@chakra-ui/react";
import { Field } from "../../components/ui/field.jsx";
import { useState } from "react";
import { Button } from "../../components/ui/button.jsx";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toaster } from "../../components/ui/toaster.jsx";
import { jwtDecode } from "jwt-decode";

export function MemberLogin() {
  const [memberId, setMemberId] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleLoginClick = () => {
    let isValid = true;

    setErrorMessage("");

    if (!memberId && !password) {
      isValid = false;
      setErrorMessage("아이디와 비밀번호를 입력해 주세요.");
    } else if (!memberId) {
      isValid = false;
      setErrorMessage("아이디를 입력해 주세요.");
    } else if (!password) {
      isValid = false;
      setErrorMessage("비밀번호를 입력해 주세요.");
    }

    if (!isValid) {
      return;
    }

    axios
      .post("/api/member/login", { memberId, password })
      .then((res) => res.data)
      .then((data) => {
        console.log(data); // 응답 확인
        toaster.create({
          type: data.message.type,
          description: data.message.text,
        });

        // JWT 디코딩
        const decodedToken = jwtDecode(data.token);
        const userScope = decodedToken.scope || ""; // 빈 문자열 처리

        // 권한에 따라 경로 이동
        if (userScope === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("main");
        }

        // 토큰 저장
        localStorage.setItem("token", data.token);
      })
      .catch((e) => {
        const message = e.response?.data?.message || {
          type: "error",
          text: "알 수 없는 오류가 발생했습니다.",
        };

        if (
          message.text.includes("아이디") ||
          message.text.includes("비밀번호")
        ) {
          setErrorMessage("아이디 또는 비밀번호가 틀렸습니다.");
        } else {
          setErrorMessage("알 수 없는 오류가 발생했습니다.");
        }

        toaster.create({
          type: message.type,
          description: message.text,
        });
      });
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
          <Input
            placeholder="비밀번호"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field>
        <Box>
          <Button onClick={handleLoginClick}>로그인</Button>
        </Box>
        {errorMessage && (
          <Box color="red.500" mt={2}>
            <p>{errorMessage}</p>
          </Box>
        )}
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
