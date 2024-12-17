import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Group, HStack, Input, Stack, Text } from "@chakra-ui/react";
import { Field } from "../../components/ui/field.jsx";
import { Button } from "../../components/ui/button.jsx";
import { Checkbox } from "../../components/ui/checkbox.jsx";
import axios from "axios";
import { toaster } from "../../components/ui/toaster.jsx";

export function MemberSocial() {
  const location = useLocation();
  const { email, nickname, profileImage, platform } = location.state || {};
  const [newNickname, setNickName] = useState(nickname || "");
  const [useProfileImage, setUseProfileImage] = useState(false);
  const [nicknameCheckMessage, setNickNameCheckMessage] = useState("");
  const [nicknameCheck, setNickNameCheck] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
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
    <Box>
      <HStack>
        <Text fontSize="2xl" fontWeight="bold" mb={5} m={2}>
          {platform === "naver" ? "네이버 회원가입" : "카카오 회원가입"} 추가
          정보
        </Text>
        <Button
          onClick={() => {
            navigate("/");
          }}
        >
          취소
        </Button>
      </HStack>
      <Stack gap={5}>
        <Field readOnly label="이메일">
          <Input value={email} />
        </Field>

        <Field
          label={"닉네임"}
          helperText={
            nicknameCheckMessage && (
              <Text color={nicknameCheck ? "green.500" : "red.500"}>
                {nicknameCheckMessage}
              </Text>
            )
          }
        >
          <Group attached w={"100%"}>
            <Input
              value={newNickname}
              placeholder={nickname}
              onChange={(e) => {
                setNickName(e.target.value);
              }}
            />

            <Button
              onClick={() => handleNickNameCheckClick(nickname)}
              variant={"outline"}
              disabled={nicknameCheckButtonDisabled}
            >
              중복 확인
            </Button>
          </Group>
        </Field>
        {profileImage && (
          <Checkbox
            checked={useProfileImage}
            onChange={(e) => setUseProfileImage(!useProfileImage)}
          >
            {platform === "naver"
              ? "네이버 프로필 이미지 사용"
              : "카카오 프로필 이미지 사용"}
          </Checkbox>
        )}

        <Button w={"100%"} onClick={handleSaveClick} disabled={disabled}>
          회원 가입
        </Button>
      </Stack>
    </Box>
  );
}
