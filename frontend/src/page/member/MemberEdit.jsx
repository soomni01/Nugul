import { Box, Group, Input, Spinner, Stack, Text } from "@chakra-ui/react";
import { Field } from "../../components/ui/field.jsx";
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
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toaster } from "../../components/ui/toaster.jsx";

export function MemberEdit() {
  const { memberId } = useParams();
  const [member, setMember] = useState(null);
  const [password, setPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [name, setName] = useState("");
  const [nickName, setNickName] = useState("");
  const [nickNameCheck, setNickNameCheck] = useState(false);
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const passwordRegEx =
    /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,50}$/;

  const nicknameRegex = /^[a-zA-Z가-힣][a-zA-Z가-힣0-9]{1,49}$/;

  const processNickname = (nickName) => {
    if (/^[a-zA-Z]/.test(nickName)) {
      return nickName.charAt(0).toUpperCase() + nickName.slice(1).toLowerCase();
    }
    return nickName;
  };

  useEffect(() => {
    axios.get(`/api/member/${memberId}`).then((res) => {
      setMember(res.data);
      setPassword(res.data.password);
      setNickName(res.data.nickName);
      setName(res.data.name);
    });
  }, []);

  function handleSaveClick() {
    axios
      .put("/api/member/update", {
        memberId: member.memberId,
        password,
        name,
        nickName,
        oldPassword,
      })
      .then((res) => {
        const message = res.data.message;

        toaster.create({
          type: message.type,
          description: message.text,
        });
        navigate(`/member/${memberId}`);
      })
      .catch((e) => {
        const message = e.response.data.message;

        toaster.create({
          type: message.type,
          description: message.text,
        });
      })
      .finally(() => {
        setOpen(false);
        setPassword("");
      });
  }

  if (member == null) {
    return <Spinner />;
  }

  const handleNickNameCheckClick = () => {
    if (!isNickNameValid) {
      toaster.create({
        type: "error",
        description:
          "닉네임 형식이 올바르지 않습니다. (영문/한글 시작, 3자 이상)",
      });
      return;
    }

    axios
      .get("/api/member/check", { params: { nickName } })
      .then((res) => res.data)
      .then((data) => {
        const message = data.message;
        toaster.create({
          type: message.type,
          description: message.text,
        });
        setNickNameCheck(data.available);
      });
  };

  const handleNickNameChange = (e) => {
    const input = e.target.value;
    setNickName(processNickname(input));
    setNickNameCheck(false);
  };

  const isPasswordValid = passwordRegEx.test(password);
  const isNickNameValid = nicknameRegex.test(nickName);

  let nickNameCheckButtonDisabled = !isNickNameValid || nickName.length === 0;
  return (
    <Box>
      <h3>회원정보 수정</h3>
      <Stack gap={5}>
        <Field readOnly label={"아이디"}>
          <Input defaultValue={member.memberId} />
        </Field>
        <Field
          label={"암호"}
          helperText={
            !password ? (
              "비밀번호는 영문, 숫자, 특수문자를 포함해 8자 이상이어야 합니다."
            ) : passwordRegEx.test(password) ? (
              <Text color="green.500">비밀번호가 올바른 형식입니다.</Text>
            ) : (
              <Text color="red.500">
                비밀번호 형식이 올바르지 않습니다. (영문, 숫자, 특수문자 포함,
                8자 이상)
              </Text>
            )
          }
        >
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            isInvalid={!isPasswordValid}
            errorBorderColor="red.300"
          />
        </Field>
        <Field label={"이름"}>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </Field>
        <Field
          label={"별명"}
          helperText={
            !nickName ? (
              "닉네임은 영문/한글로 시작하며, 2자 이상 50자 이하이어야 합니다."
            ) : isNickNameValid ? (
              <Text color="green.500">닉네임 형식이 올바릅니다.</Text>
            ) : (
              <Text color="red.500">
                닉네임 형식이 올바르지 않습니다. (영문/한글 시작, 2자 이상)
              </Text>
            )
          }
        >
          <Group attached w={"100%"}>
            <Input
              value={nickName}
              onChange={handleNickNameChange}
              isInvalid={!isNickNameValid}
            />
            <Button
              onClick={handleNickNameCheckClick}
              disabled={nickNameCheckButtonDisabled}
            >
              중복확인
            </Button>
          </Group>
        </Field>
        <Box>
          <DialogRoot open={open} onOpenChange={(e) => setOpen(e.open)}>
            <DialogTrigger asChild>
              <Button colorPalette={"blue"} disabled={!isPasswordValid}>
                저장
              </Button>
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
                      onChange={handleNickNameChange}
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
        </Box>
      </Stack>
    </Box>
  );
}
