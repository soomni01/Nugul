import {
  Box,
  Group,
  HStack,
  Image,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Field } from "../../components/ui/field.jsx";
import { useContext, useState } from "react";
import { Button } from "../../components/ui/button.jsx";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toaster } from "../../components/ui/toaster.jsx";
import { jwtDecode } from "jwt-decode";
import { PasswordInput } from "../../components/ui/password-input.jsx";
import { AuthenticationContext } from "../../components/context/AuthenticationProvider.jsx";
import { KakaoLogin } from "../../components/social/KakaoLogin.jsx";
import { NaverLogin } from "../../components/social/NaverLogin.jsx";
import { MdOutlineEmail } from "react-icons/md";
import { TbLock } from "react-icons/tb";

export function MemberLogin() {
  const [memberId, setMemberId] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const authentication = useContext(AuthenticationContext);

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
          navigate("/admin/members");
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
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      flexDirection="column" // 세로 정렬
    >
      {/* 메인 로고 이미지 추가 (위치 수정 필요) */}
      <Box mb={10}>
        <Image
          src="/image/MainLogo.png"
          maxWidth="230px" // 너비 제한
          maxHeight="100px" // 높이 제한
        />
      </Box>
      <Box>
        <Text
          fontSize="2xl"
          fontWeight="bold"
          justifyContent="center"
          display="flex"
          mb={8}
        >
          로그인
        </Text>
        <Stack gap={5}>
          <Field>
            <Group attached w={"100%"}>
              <Button
                variant={"outline"}
                _hover={{ bg: "transparent" }}
                size={"xl"}
                cursor={"default"}
              >
                <MdOutlineEmail />
              </Button>

              <Input
                size={"xl"}
                placeholder="이메일"
                value={memberId}
                onChange={(e) => setMemberId(e.target.value)}
              />
            </Group>
          </Field>

          <Group attached w={"100%"}>
            <Button
              variant={"outline"}
              _hover={{ bg: "transparent" }}
              size={"xl"}
              cursor={"default"}
              tabIndex={-1}
            >
              <TbLock />
            </Button>
            <Field>
              <PasswordInput
                size={"xl"}
                placeholder="비밀번호 입력"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Field>
          </Group>
        </Stack>
        <Box display="flex" mt={5}>
          <Button w={"100%"} onClick={handleLoginClick}>
            로그인
          </Button>
        </Box>

        <Box textAlign="end" mt={3}>
          <Link to="/member/signup">회원가입</Link>
        </Box>
        <HStack display="flex" justifyContent="center" mb={90}>
          <KakaoLogin />
          <NaverLogin />
        </HStack>
      </Box>
    </Box>
  );
}
