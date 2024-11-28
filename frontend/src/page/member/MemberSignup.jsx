import { useState } from "react";
import { Box, Group, Input, Stack, Text } from "@chakra-ui/react";
import { Field } from "../../components/ui/field.jsx";
import { Button } from "../../components/ui/button.jsx";
import axios from "axios";
import { toaster } from "../../components/ui/toaster.jsx";
import { useNavigate } from "react-router-dom";

export function MemberSignup() {
  const [memberId, setMemberId] = useState("");
  const [idCheckMessage, setIdCheckMessage] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [nickName, setNickName] = useState("");
  const [idCheck, setIdCheck] = useState(false);
  const [rePassword, setRePassword] = useState("");
  const [nickNameCheck, setNickNameCheck] = useState(false);
  const navigate = useNavigate();

  const emailRegEx =
    /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/;

  const passwordRegEx =
    /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,50}$/;

  function handleSaveClick() {
    if (!passwordRegEx.test(password)) {
      toaster.create({
        type: "error",
        description:
          "비밀번호는 영문, 숫자, 특수문자를 포함해 8자 이상이어야 합니다.",
      });
      return;
    }
    axios
      .post("/api/member/signup", {
        memberId,
        password,
        name,
        nickName,
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
      })
      .finally(() => {});
  }

  const handleIdCheckClick = () => {
    if (!emailRegEx.test(memberId)) {
      toaster.create({
        type: "error",
        description: "이메일 형식이 잘못되었습니다.",
      });
      setIdCheckMessage("이메일 형식이 잘못되었습니다.");
      return;
    }

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

        if (data.available) {
          setIdCheckMessage("사용 가능합니다.");
          setIdCheck(true);
        } else {
          setIdCheckMessage("이미 사용 중인 이메일입니다.");
          setIdCheck(false);
        }
      })
      .catch((e) => {
        setIdCheckMessage("서버 오류가 발생했습니다.");
        toaster.create({
          type: "error",
          description: "서버 오류가 발생했습니다.",
        });
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
    if (nickNameCheck) {
      if (password === rePassword) {
        disabled = false;
      }
    }
  }

  let nickNameCheckButtonDisabled = nickName.length === 0;

  return (
    <Box>
      <h3>회원 가입</h3>
      <Stack gap={5}>
        <Field
          label={"아이디"}
          helperText={
            idCheckMessage ? (
              <Text color={idCheck ? "green.500" : "red.500"}>
                {idCheckMessage}
              </Text>
            ) : (
              ""
            )
          }
        >
          <Group attached w={"100%"}>
            <Input
              value={memberId}
              placeholder="이메일를 입력하세요"
              onChange={(e) => {
                setIdCheck(false);
                setMemberId(e.target.value);
                setIdCheckMessage("");
              }}
            />
            <Button onClick={handleIdCheckClick} variant={"outline"}>
              중복확인
            </Button>
          </Group>
        </Field>
        <Field
          label={"암호"}
          placehold
          helperText={
            "비밀번호는 영문, 숫자, 특수문자를 포함해 8자 이상이어야 합니다."
          }
        >
          <Input
            value={password}
            placeholder="암호를 입력하세요"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </Field>
        <Field label={"암호확인"} helperText={"암호 재입력하세요"}>
          <Input
            placeholder="암호를 재입력하세요"
            value={rePassword}
            onChange={(e) => setRePassword(e.target.value)}
          />
        </Field>
        <Field label={"이름"} helperText={"본명을 쓰세요"}>
          <Input
            value={name}
            placeholder="이름을 입력하세요"
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </Field>
        <Field label={"별명"} helperText={"별명을 쓰세요"}>
          <Group attached w={"100%"}>
            <Input
              value={nickName}
              placeholder="별명을 입력하세요"
              onChange={(e) => {
                setNickName(e.target.value);
                setNickNameCheck(false);
              }}
            />
            <Button
              disabled={nickNameCheckButtonDisabled}
              onClick={handleNickNameCheckClick}
              variant={"outline"}
            >
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
