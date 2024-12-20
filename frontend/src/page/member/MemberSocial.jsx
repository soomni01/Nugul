import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
import { Button } from "../../components/ui/button.jsx";
import { Checkbox } from "../../components/ui/checkbox.jsx";
import axios from "axios";
import { toaster } from "../../components/ui/toaster.jsx";
import { MdOutlineEmail } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";
import { ToggleTip } from "../../components/ui/toggle-tip.jsx";
import { LuInfo } from "react-icons/lu";

export function MemberSocial() {
  const location = useLocation();
  const { email, nickname, profileImage, platform } = location.state || {};
  const [newNickname, setNickName] = useState(nickname || "");
  const [useProfileImage, setUseProfileImage] = useState(false);
  const [nicknameCheckMessage, setNickNameCheckMessage] = useState("");
  const [nicknameCheck, setNickNameCheck] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }

    // 닉네임 중복 체크
    if (newNickname) {
      handleNickNameCheckClick(newNickname);
    }
  }, []);

  const handleNickNameCheckClick = (checkNickname) => {
    axios
      .get("/api/member/check", {
        params: { nickname: checkNickname },
      })
      .then((res) => res.data)
      .then((data) => {
        if (data.available) {
          setNickNameCheckMessage("사용 가능한 닉네임입니다.");
          setNickNameCheck(true);
        } else {
          setNickNameCheckMessage("이미 사용 중인 별명입니다.");
          setNickNameCheck(false);
        }
      })
      .catch(() => {
        setNickNameCheckMessage("서버 오류가 발생했습니다.");
        toaster.create({
          type: "error",
          description: "서버 오류가 발생했습니다.",
        });
      });
  };

  function handleSaveClick() {
    axios
      .post("/api/member/signup", {
        memberId: email,
        nickname: newNickname,
        profileImage: useProfileImage ? profileImage : "",
      })
      .then((res) => {
        const message = res.data.message;
        toaster.create({
          type: message.type,
          description: message.text,
        });
        navigate("/");
      })
      .catch((e) => {
        const message = e.response.data.message;

        toaster.create({
          type: message.type,
          description: message.text,
        });
      });
  }

  const disabled = !nicknameCheck;
  const nicknameCheckButtonDisabled = !newNickname || newNickname.length === 0;

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="100vh"
    >
      <Box>
        <Text
          justifyContent="center"
          display="flex"
          fontSize="2xl"
          fontWeight="bold"
          mb={3}
        >
          <Image
            src={
              platform === "naver"
                ? "/image/NaverLogin.png"
                : "/image/KakaoLogin.png"
            }
            boxSize="30px"
            mt={1}
            mr={3}
          />
          회원가입
        </Text>
        <HStack gap={0} display="flex" justifyContent="center" mb={8}>
          <Text fontSize="lg" fontWeight="bold">
            사용자 정보 추가 입력
          </Text>
          <ToggleTip content="네이버 로그인에서 제공하는 '이메일' 주소 정보는 이용자가 계정에 등록한 '연락처 이메일' 정보입니다.">
            <Button size="xs" variant="ghost">
              <LuInfo />
            </Button>
          </ToggleTip>
        </HStack>

        <Stack gap={5}>
          <Group attached w={"100%"}>
            <Button
              variant={"outline"}
              _hover={{ bg: "transparent" }}
              size={"xl"}
              cursor={"default"}
              tabIndex={-1}
            >
              <MdOutlineEmail />
            </Button>
            <Input size={"xl"} value={email} />
          </Group>

          <Field
            helperText={
              nicknameCheckMessage && (
                <Text color={nicknameCheck ? "green.500" : "red.500"}>
                  {nicknameCheckMessage}
                </Text>
              )
            }
          >
            <Group attached w={"100%"}>
              <Button
                variant={"outline"}
                _hover={{ bg: "transparent" }}
                size={"xl"}
                cursor={"default"}
                tabIndex={-1}
              >
                <FaRegUser />
              </Button>
              <Group>
                <Input
                  size={"xl"}
                  value={newNickname}
                  placeholder={nickname}
                  onChange={(e) => {
                    setNickName(e.target.value);
                  }}
                />

                <Button
                  size={"xl"}
                  onClick={() => handleNickNameCheckClick(newNickname)}
                  variant={"outline"}
                  disabled={nicknameCheckButtonDisabled}
                >
                  중복 확인
                </Button>
              </Group>
            </Group>
          </Field>

          {profileImage && (
            <Checkbox
              ml={1}
              size={"md"}
              checked={useProfileImage}
              onChange={(e) => setUseProfileImage(!useProfileImage)}
            >
              {platform === "naver"
                ? "네이버 프로필 이미지 사용"
                : "카카오 프로필 이미지 사용"}
            </Checkbox>
          )}

          <Button
            ml={1}
            mt={3}
            w={"99%"}
            onClick={handleSaveClick}
            disabled={disabled}
          >
            회원가입
          </Button>
        </Stack>
        <Text
          mt={3}
          color="gray"
          cursor="pointer"
          textAlign="end"
          onClick={() => {
            navigate("/");
          }}
        >
          취소
        </Text>
      </Box>
    </Box>
  );
}
