import { useState } from "react";
import { Box, Group, Input, Stack } from "@chakra-ui/react";
import { Field } from "../../components/ui/field.jsx";
import { Button } from "../../components/ui/button.jsx";
import axios from "axios";
import { toaster } from "../../components/ui/toaster.jsx";
import { useNavigate } from "react-router-dom";

export function MemberSignup() {
  const [memberId, setMemberId] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [nickName, setNickName] = useState("");
  const [idCheck, setIdCheck] = useState(false);
  const [rePassword, setRePassword] = useState("");
  const [nickNameCheck, setNickNameCheck] = useState(false);
  const navigate = useNavigate();

  function handleSaveClick() {
    axios
      .post("/api/member/signup", { memberId, password, name, nickName })
      .then((res) => {
        console.log("잘됨, 페이지 이동, 토스트 출력");
        const message = res.data.message;
        toaster.create({
          type: message.type,
          description: message.text,
        });
        navigate("/");
      })
      .catch((e) => {
        console.log("안됐을 때 해야하는 일, 토스트 출력");
        const message = e.response.data.message;

        toaster.create({
          type: message.type,
          description: message.text,
        });
      })
      .finally(() => {
        console.log("성공이든 실패든 무조건 실행");
      });
  }

  const handleIdCheckClick = () => {
    axios
      .get("/api/member/check", {
        params: {
          id: memberId,
        },
      })
      .then((res) => res.data)
      .then((data) => {
        const message = data.message;
        toaster.create({
          type: message.type,
          description: message.text,
        });

        setIdCheck(data.available);
      });
  };

  const handleNickNameCheckClick = () => {
    axios
      .get("/api/member/check", {
        params: {
          nickName,
        },
      })
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

  let disabled = true;
  if (idCheck) {
    if (password === rePassword) {
      disabled = false;
    }
  }

  return (
    <Box>
      <h3>회원 가입</h3>
      <Stack gap={5}>
        <Field label={"아이디"} placehold>
          <Group attached w={"100%"}>
            <Input
              value={memberId}
              placeholder="이메일를 입력하세요"
              onChange={(e) => {
                setIdCheck(false);
                setMemberId(e.target.value);
              }}
            />
            <Button onClick={handleIdCheckClick} variant={"outline"}>
              중복확인
            </Button>
          </Group>
        </Field>
        <Field label={"암호"} placehold>
          <Input
            value={password}
            placeholder="암호를 입력하세요"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </Field>
        <Field label={"암호확인"}>
          <Input
            placeholder="암호를 재입력하세요"
            value={rePassword}
            onChange={(e) => setRePassword(e.target.value)}
          />
        </Field>
        <Field label={"이름"} placehold>
          <Input
            value={name}
            placeholder="이름을 입력하세요"
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </Field>
        <Field label={"별명"} placehold>
          <Group attached w={"100%"}>
            <Input
              value={nickName}
              placeholder="별명을 입력하세요"
              onChange={(e) => {
                setNickName(e.target.value);
              }}
            />
            <Button onClick={handleNickNameCheckClick} variant={"outline"}>
              중복확인
            </Button>
          </Group>
        </Field>
        <Button disabled={disabled} onClick={handleSaveClick}>
          가입
        </Button>
      </Stack>
    </Box>
  );
}
