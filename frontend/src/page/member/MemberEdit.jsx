import { Box, Input, Spinner, Stack } from "@chakra-ui/react";
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
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

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
  return (
    <Box>
      <h3>회원정보 수정</h3>
      <Stack gap={5}>
        <Field readOnly label={"아이디"}>
          <Input defaultValue={member.memberId} />
        </Field>
        <Field label={"암호"}>
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field>
        <Field readOnly label={"이름"}>
          <Input defaultValue={member.name} />
        </Field>
        <Field label={"별명"}>
          <Input
            value={nickName}
            onChange={(e) => setNickName(e.target.value)}
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
                      onChange={(e) => setOldPassword(e.target.value)}
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
