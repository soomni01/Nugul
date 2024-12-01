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
          navigate("main");
        }

        localStorage.setItem("token", data.token);
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
