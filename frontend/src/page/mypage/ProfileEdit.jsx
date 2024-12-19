import { Box, HStack, Input, Stack, Text } from "@chakra-ui/react";
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

export function ProfileEdit({ id, onCancel, onSave }) {
  const [member, setMember] = useState(null);
  const [password, setPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [nickname, setNickName] = useState("");
  const [nickNameCheck, setNickNameCheck] = useState(null); // 닉네임 유효성 상태 (null: 확인 안됨, true: 중복 아님, false: 중복)
  const [open, setOpen] = useState(false);

  const passwordRegEx =
    /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,50}$/;

  useEffect(() => {
    axios.get(`/api/member/${id}`).then((res) => {
      setMember(res.data);
      setPassword(res.data.password);
      setNickName(res.data.nickname);
    });
  }, []);

  const handleSaveClick = () => {
    axios
      .put(`/api/member/update`, {
        memberId: id,
        password,
        nickname,
        oldPassword,
      }) // 서버로 수정 요청
      .then(() => {
        toaster.create({
          type: "success",
          description: "수정이 완료되었습니다.",
        });
        onSave();
      })
      .catch((err) =>
        toaster.create({
          type: "error",
          description: "내 정보 수정 중 오류가 발생했습니다.",
        }),
      )
      .finally();
  };

  const handleNickNameCheckClick = () => {
    if (!nickname || nickname === member?.nickname) {
      return; // 닉네임이 비어있으면 중복 확인을 하지 않음
    }
    axios
      .get("/api/member/check", { params: { nickname } })
      .then((res) => res.data)
      .then((data) => {
        setNickNameCheck(data.available); // 닉네임 중복 여부 설정
      });
  };

  const isPasswordValid = passwordRegEx.test(password);

  return (
    <Box>
      <h3>프로필 수정</h3>
      <Stack gap={5}>
        <Field readOnly label={"아이디"}>
          <Input defaultValue={member?.memberId || ""} />
        </Field>
        {member?.password && (
          <Field label={"암호"}>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              isInvalid={!isPasswordValid}
              placeholder={
                "비밀번호는 영문, 숫자, 특수문자를 포함해 8자 이상이어야 합니다."
              }
            />
            {password && !isPasswordValid && (
              <Text fontSize="sm" color="red.500">
                비밀번호는 영문, 숫자, 특수문자를 포함해 8자 이상이어야 합니다.
              </Text>
            )}
          </Field>
        )}
        <Field label={"별명"}>
          <HStack w="100%">
            <Input
              value={nickname}
              onChange={(e) => setNickName(e.target.value)} // 닉네임 값 변경
              borderColor={nickNameCheck === false ? "red.500" : "gray.300"} // 중복일 때 빨간색 테두리
            />
            <Button
              onClick={handleNickNameCheckClick}
              variant={"outline"}
              disabled={!nickname} // 닉네임이 비어있으면 버튼 비활성화
            >
              중복 확인
            </Button>
          </HStack>
          {nickNameCheck !== null && (
            <Text
              fontSize="sm"
              color={nickNameCheck ? "green.500" : "red.500"} // 중복 아닐 때 초록색, 중복일 때 빨간색
            >
              {nickNameCheck
                ? "사용 가능한 별명입니다."
                : "이미 사용 중인 별명입니다."}
            </Text>
          )}
        </Field>

        <Field label={"가입일시"}>
          <Input
            type={"date"}
            readOnly
            value={member?.inserted ? member.inserted.split("T")[0] : ""}
          />
        </Field>
        <Box>
          <DialogRoot open={open} onOpenChange={(e) => setOpen(e.open)}>
            <DialogTrigger asChild>
              <Button colorPalette={"blue"}>저장</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>회원 정보 변경 확인</DialogTitle>
              </DialogHeader>
              <DialogBody>
                <Stack gap={5}>
                  <Field label={"기존 암호"}>
                    <Input
                      placeholder={"기존 암호를 입력해주세요."}
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
                <Button colorPalette={"blue"} onClick={handleSaveClick}>
                  저장
                </Button>
              </DialogFooter>
            </DialogContent>
          </DialogRoot>
          <Button onClick={onCancel} variant={"outline"}>
            취소
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
