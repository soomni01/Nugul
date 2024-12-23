import { Box, Flex, Input, Stack, Text } from "@chakra-ui/react";
import { Field } from "../../components/ui/field.jsx";
import { useEffect, useState } from "react";
import { Button } from "../../components/ui/button.jsx";
import axios from "axios";
import { toaster } from "../../components/ui/toaster.jsx";
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
import { useTheme } from "../../components/context/ThemeProvider.jsx";

export function ProfileEdit({ id, onCancel, onSave }) {
  const [member, setMember] = useState(null);
  const [password, setPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [nickname, setNickName] = useState("");
  const [nickNameCheck, setNickNameCheck] = useState(null); // 닉네임 유효성 상태 (null: 확인 안됨, true: 중복 아님, false: 중복)
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { fontColor, buttonColor } = useTheme();

  const passwordRegEx =
    /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,50}$/;

  // 데이터 로딩 함수
  const loadMemberData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/api/member/${id}`);
      const memberData = response.data;
      setMember(memberData);
      setPassword(memberData.password || "");
      setNickName(memberData.nickname || "");
    } catch (error) {
      toaster.create({
        type: "error",
        description: "회원 정보를 불러오는데 실패했습니다.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 컴포넌트 마운트 시 데이터 로딩
  useEffect(() => {
    if (id) {
      loadMemberData();
    }
  }, [id]);

  const handleSaveClick = async () => {
    try {
      await axios.put(`/api/member/update`, {
        memberId: id,
        password,
        nickname,
        oldPassword,
      });

      toaster.create({
        type: "success",
        description: "수정이 완료되었습니다.",
      });

      // 저장 후 데이터 리로드
      await loadMemberData();
      onSave();
      setOpen(false);
    } catch (error) {
      toaster.create({
        type: "error",
        description: "내 정보 수정 중 오류가 발생했습니다.",
      });
    }
  };

  const handleNickNameCheckClick = () => {
    if (!nickname || nickname === member?.nickname) {
      return;
    }
    axios
      .get("/api/member/check", { params: { nickname } })
      .then((res) => res.data)
      .then((data) => {
        setNickNameCheck(data.available); // 닉네임 중복 여부 설정
      });
  };

  const isPasswordValid = passwordRegEx.test(password);

  if (isLoading) {
    return <Box>로딩 중...</Box>;
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
        내 정보 수정
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
          <Input defaultValue={id || ""} readOnly width="450px" height="45px" />
        </Flex>

        {member?.password && (
          <Flex alignItems="center" mt={3} direction="column">
            <Flex alignItems="center">
              <Text
                fontWeight="bold"
                whiteSpace="nowrap"
                mr={4}
                ml={-8}
                width="100px"
                textAlign="right"
              >
                비밀번호
              </Text>
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                isInvalid={!isPasswordValid}
                width="450px"
                height="45px"
              />
            </Flex>
            {password && !isPasswordValid && (
              <Text fontSize="sm" color="red.500" mt={2} ml={6}>
                비밀번호는 8자 이상, 영문, 숫자, 특수문자를 포함해야 합니다.
              </Text>
            )}
          </Flex>
        )}
        {member?.nickname && (
          <Flex alignItems="center" mt={2} direction="column">
            <Flex alignItems="center">
              <Text
                fontWeight="bold"
                whiteSpace="nowrap"
                mr={4}
                ml={-7}
                width="100px"
                textAlign="right"
              >
                닉네임
              </Text>
              <Input
                value={nickname}
                onChange={(e) => setNickName(e.target.value)}
                borderColor={nickNameCheck === false ? "red.500" : "gray.300"}
                width="350px"
                height="45px"
                mr={2}
              />
              <Button
                onClick={handleNickNameCheckClick}
                variant={"outline"}
                disabled={!nickname}
              >
                중복 확인
              </Button>
            </Flex>

            {nickNameCheck !== null && (
              <Text
                fontSize="sm"
                color={nickNameCheck ? "green.500" : "red.500"}
                mt={2}
                mr={195}
              >
                {nickNameCheck
                  ? "사용 가능한 닉네임입니다."
                  : "이미 사용 중인 닉네임입니다."}
              </Text>
            )}
          </Flex>
        )}
        <Flex alignItems="center" mt={2}>
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
            value={member?.inserted ? member.inserted.split("T")[0] : ""}
            width="450px"
            height="45px"
          />
        </Flex>
        <Box display="flex" justifyContent="center" alignItems="center">
          <DialogRoot open={open} onOpenChange={(e) => setOpen(e.open)}>
            <DialogTrigger asChild>
              <Button
                colorPalette={"black"}
                mt={3}
                mr={4}
                color={fontColor}
                fontWeight="bold"
                bg={buttonColor}
                _hover={{ bg: `${buttonColor}AA` }}
              >
                저장
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>내 정보 변경 확인</DialogTitle>
              </DialogHeader>
              <DialogBody>
                <Stack gap={5}>
                  <Field>
                    <Input
                      placeholder={"기존 비밀번호를 입력해 주세요."}
                      value={oldPassword}
                      onChange={(e) => {
                        setOldPassword(e.target.value);
                      }}
                    />
                  </Field>
                </Stack>
              </DialogBody>
              <DialogFooter>
                <DialogActionTrigger>
                  <Button variant={"outline"}>취소</Button>
                </DialogActionTrigger>
                <Button
                  color={fontColor}
                  fontWeight="bold"
                  bg={buttonColor}
                  _hover={{ bg: `${buttonColor}AA` }}
                  onClick={handleSaveClick}
                >
                  저장
                </Button>
              </DialogFooter>
            </DialogContent>
          </DialogRoot>
          <Button onClick={onCancel} variant={"outline"} mt={3}>
            취소
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
