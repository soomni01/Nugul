import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Group, HStack, Input, Stack, Text } from "@chakra-ui/react";
import { Field } from "../../components/ui/field.jsx";
import { Button } from "../../components/ui/button.jsx";
import { Checkbox } from "../../components/ui/checkbox.jsx";
import axios from "axios";
import { toaster } from "../../components/ui/toaster.jsx";

export function KakaoCallback() {
  const [email, setEmail] = useState("");
  const [nickname, setNickName] = useState("");
  const [nicknameCheckMessage, setNickNameCheckMessage] = useState("");
  const [nicknameCheck, setNickNameCheck] = useState(false);
  const [profileImage, setProfileImage] = useState("");
  const navigate = useNavigate();

  // URL에서 인가 코드 추출
  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");

    // 카카오 서버로 토큰 요청
    if (code) {
      requestKakaoToken(code);
    }
  }, []);

  // 토큰 받고 callback 페이지로 redirect
  const requestKakaoToken = async (code) => {
    try {
      const response = await fetch("https://kauth.kakao.com/oauth/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          client_id: import.meta.env.VITE_KAKAO_REST_KEY,
          redirect_uri: "http://localhost:5173/kakao/callback",
          code: code,
        }),
      });

      const data = await response.json();
      console.log("카카오 토큰 응답:", data);

      // 액세스 토큰으로 사용자 정보 가져오기
      if (data.access_token) {
        fetchKakaoUserInfo(data.access_token);
      }
    } catch (error) {
      console.error("토큰 요청 중 에러:", error);
    }
  };

  const fetchKakaoUserInfo = async (accessToken) => {
    try {
      const response = await fetch("https://kapi.kakao.com/v2/user/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const userData = await response.json();
      // 토큰 정보 출력
      console.log("액세스 토큰:", accessToken);

      // 이메일 정보 추출
      const kakaoEmail = userData.kakao_account?.email || "이메일 없음";
      setEmail(kakaoEmail);
      console.log("이메일:", kakaoEmail);

      // 닉네임 정보 추출
      const kakaoNickname =
        userData.kakao_account?.profile?.nickname || "닉네임 없음";
      setNickName(kakaoNickname);
      console.log("닉네임:", kakaoNickname);

      // 프로필 이미지 정보 추출
      const kakaoProfileImage =
        userData.kakao_account?.profile?.profile_image_url ||
        "프로필 이미지 없음";
      setProfileImage(kakaoProfileImage);
      console.log("프로필 이미지 URL:", kakaoProfileImage);

      // 자동으로 닉네임 중복 체크 수행
      if (kakaoNickname !== "닉네임 없음") {
        handleNickNameCheckClick(kakaoNickname);
      }
    } catch (error) {
      console.error("사용자 정보 요청 중 에러:", error);
    }
  };

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

  let nicknameCheckButtonDisabled = nickname.length === 0;

  return (
    <Box>
      <HStack>
        <Text fontSize="2xl" fontWeight="bold" mb={5} m={2}>
          카카오 회원가입 추가 정보
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
              value={nickname}
              placeholder={nickname}
              onChange={(e) => {
                setNickName(e.target.value);
              }}
            />

            <Button
              display={"none"}
              onClick={handleNickNameCheckClick(nickname)}
              variant={"outline"}
              disabled={nicknameCheckButtonDisabled}
            >
              중복 확인
            </Button>
          </Group>
        </Field>
        {profileImage !== "프로필 이미지 없음" && (
          <Checkbox
          // isChecked={useProfileImage}
          // onChange={(e) => setUseProfileImage(e.target.checked)}
          >
            카카오 프로필 이미지 사용
          </Checkbox>
        )}

        <Button w={"100%"}>회원 가입</Button>
      </Stack>
    </Box>
  );
}
