import { Box, Input, Stack } from "@chakra-ui/react";
import { Field } from "../../components/ui/field.jsx";
import { useState } from "react";
import { Button } from "../../components/ui/button.jsx";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toaster } from "../../components/ui/toaster.jsx";

export function MemberLogin() {
  const [memberId, setMemberId] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const emailRegEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleLoginClick = () => {
    let isValid = true;

    setErrorMessage("");

    if (!memberId && !password) {
      toaster.create({
        type: "error",
        description: "이메일과 비밀번호를 입력해주세요.",
      });
      setErrorMessage("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    if (!memberId) {
      toaster.create({
        type: "error",
        description: "이메일을 입력해주세요.",
      });
      setErrorMessage("이메일을 입력해주세요.");
      return;
    }

    if (!password) {
      toaster.create({
        type: "error",
        description: "비밀번호를 입력해주세요.",
      });
      setErrorMessage("비밀번호를 입력해주세요.");
      return;
    }

    if (!emailRegEx.test(memberId)) {
      toaster.create({
        type: "error",
        description: "이메일 형식이 잘못되었습니다.",
      });
      setErrorMessage("이메일 형식이 잘못되었습니다.");
      return;
    }

    axios
      .post("/api/member/login", { memberId, password })
      .then((res) => {
        const data = res.data;

        console.log("응답 데이터:", data);
        console.log("데이터의 auth 값:", data.user?.auth); // Optional chaining 사용

        if (data.auth === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/main");
        }
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
  };

  return (
    <Box>
      <h3>로그인</h3>
      <Stack gap={5}>
        <Field>
          <Input
            placeholder="이메일을 입력하세요."
            value={memberId}
            onChange={(e) => setMemberId(e.target.value)}
          />
        </Field>
        <Field>
          <Input
            placeholder="비밀번호를 입력하세요."
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
