import { Box, Flex, Input, Spinner, Stack, Text } from "@chakra-ui/react";
import { Field } from "../../components/ui/field.jsx";
import { useContext, useEffect, useState } from "react";
import { AuthenticationContext } from "../../components/context/AuthenticationProvider.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  DialogActionTrigger,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog.jsx";
import { Button } from "../../components/ui/button.jsx";
import { toaster } from "../../components/ui/toaster.jsx";
import { kakaoUnlink } from "../../components/social/KakaoLogin.jsx";
import { naverUnlink } from "../../components/social/NaverLogin.jsx";
import { useTheme } from "../../components/context/ThemeProvider.jsx";

// 카카오 계정 연결 해제 함수 추가

export function Profile({ onEditClick }) {
  const [member, setMember] = useState(null);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState(""); // 이메일 상태 추가
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { id } = useContext(AuthenticationContext);
  const navigate = useNavigate();
  const { fontColor, buttonColor } = useTheme();

  useEffect(() => {
    if (!id) {
      return;
    }
    setLoading(true);

    axios
      .get(`/api/member/${id}`)
      .then((res) => setMember(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleDeleteClick() {
    try {
      // 소셜 로그인 사용자의 경우 이메일 검증 추가
      if (!member.password) {
        if (email !== id) {
          // id가 이메일이므로 비교
          toaster.create({
            type: "error",
            description: "가입된 이메일과 일치하지 않습니다.",
          });
          return;
        }
      }

      // 서버 회원 삭제 요청
      const response = await axios.delete("/api/member/remove", {
        data: { memberId: id, password },
      });

      // 카카오 계정 로그아웃 및 연결 해제
      if (sessionStorage.getItem("kakaoAccessToken")) {
        await kakaoUnlink(); // 연결 해제
        console.log("카카오 계정 연결 해제 성공");
        sessionStorage.removeItem("kakaoAccessToken");
      }

      if (sessionStorage.getItem("naverAccessToken")) {
        // 네이버 계정 로그아웃 처리
        await naverUnlink();
        console.log("네이버 계정 연결 해제 성공");
        sessionStorage.removeItem("naverAccessToken");
      }

      // 성공 메시지
      if (response.data.message.type === "success") {
        const message = response.data.message;
        toaster.create({
          type: message.type,
          description: message.text,
        });
        localStorage.removeItem("token");
        navigate("/"); // 회원가입 페이지로 이동
      } else {
        throw new Error("연동 해제 실패");
      }
    } catch (error) {
      console.error(error);
      const message = error.response?.data?.message || {
        type: "error",
        text: "회원 탈퇴 중 오류가 발생했습니다.",
      };
      toaster.create({
        type: message.type,
        description: message.text,
      });
    } finally {
      setOpen(false);
      setPassword("");
      setEmail("");
    }
  }

  if (loading || !id || !member) {
    return <Spinner />;
  }

  return (
    <Box
      border="1px solid gray"
      borderRadius="8px"
      p={5}
      width="800px"
      height="550px"
      boxShadow="md"
      bgColor="gray.50"
      mt={28}
      ml="auto"
      mr="auto"
    >
      <Text fontSize="2xl" fontWeight="bold" textAlign="center" mt={5} mb={5}>
        내 정보
      </Text>
      <Stack gap={5}>
        <Flex alignItems="center" mt={8}>
          <Text
            fontWeight="bold"
            whiteSpace="nowrap"
            mr={4}
            ml={20}
            width="100px"
            textAlign="right"
          >
            아이디
          </Text>
          <Input readOnly value={id} width="450px" height="45px" />
        </Flex>
        {member.password && (
          <Flex alignItems="center" mt={3}>
            <Text
              fontWeight="bold"
              whiteSpace="nowrap"
              mr={4}
              ml={20}
              width="100px"
              textAlign="right"
            >
              비밀번호
            </Text>
            <Input
              readOnly
              value={member.password}
              width="450px"
              height="45px"
            />
          </Flex>
        )}
        <Flex alignItems="center" mt={3}>
          <Text
            fontWeight="bold"
            whiteSpace="nowrap"
            mr={4}
            ml={20}
            width="100px"
            textAlign="right"
          >
            닉네임
          </Text>
          <Input readOnly value={member.nickname} width="450px" height="45px" />
        </Flex>
        <Flex alignItems="center" mt={3}>
          <Text
            fontWeight="bold"
            whiteSpace="nowrap"
            mr={4}
            ml={20}
            width="100px"
            textAlign="right"
          >
            가입 일자
          </Text>
          <Input
            type="date"
            readOnly
            value={member.inserted.split("T")[0]}
            width="450px"
            height="45px"
          />
        </Flex>
        <Flex justifyContent="center" mt={5}>
          <Button
            onClick={onEditClick}
            mr={4}
            mb={6}
            color={fontColor}
            fontWeight="bold"
            bg={buttonColor}
            _hover={{ bg: `${buttonColor}AA` }}
          >
            수정
          </Button>
          <DialogRoot open={open} onOpenChange={(e) => setOpen(e.open)}>
            <DialogTrigger asChild>
              <Button bg="red.600">탈퇴</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>탈퇴 확인</DialogTitle>
              </DialogHeader>
              <DialogBody>
                <Stack gap={5}>
                  {member.password ? (
                    <Field>
                      <Input
                        placeholder={"비밀번호를 입력해 주세요."}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </Field>
                  ) : (
                    <Field label={"이메일"}>
                      <Input
                        placeholder={"이메일을 입력해 주세요."}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </Field>
                  )}
                </Stack>
              </DialogBody>
              <DialogFooter>
                <DialogActionTrigger>
                  <Button variant="outline">취소</Button>
                </DialogActionTrigger>
                <Button bg="red.600" onClick={handleDeleteClick}>
                  탈퇴
                </Button>
              </DialogFooter>
            </DialogContent>
          </DialogRoot>
        </Flex>
      </Stack>
    </Box>
  );
}
