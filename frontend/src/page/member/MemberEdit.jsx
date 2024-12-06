import { Box, Group, Input, Spinner, Stack } from "@chakra-ui/react";
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
  const [nickname, setNickName] = useState("");
  const [nicknameCheck, setNickNameCheck] = useState(false);
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const passwordRegEx =
    /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,50}$/;

  useEffect(() => {
    axios.get(`/api/member/${memberId}`).then((res) => {
      setMember(res.data);
      setPassword(res.data.password);
      setNickName(res.data.nickname);
    });
  }, []);

  function handleSaveClick() {
    axios
      .put("/api/member/update", {
        memberId: member.memberId,
        password,
        nickname,
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
    axios
      .get("/api/member/check", { params: { nickname } })
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

  const isPasswordValid = passwordRegEx.test(password);

  let nicknameCheckButtonDisabled = nickname.length === 0;
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
            !password
              ? "비밀번호는 영문, 숫자, 특수문자를 포함해 8자 이상이어야 합니다."
              : null
          }
        >
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            isInvalid={!isPasswordValid}
            errorBorderColor="red.300"
          />
        </Field>
        <Field label={"별명"}>
          <Group attached w={"100%"}>
            <Input
              value={nickname}
              onChange={(e) => {
                setNickName(e.target.value);
              }}
            />
            <Button
              onClick={handleNickNameCheckClick}
              disabled={nicknameCheckButtonDisabled}
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
        </Box>
      </Stack>
    </Box>
  );
}
