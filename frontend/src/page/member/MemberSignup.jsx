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
  const [nickname, setNickName] = useState("");
  const [nickNameCheckMessage, setNickNameCheckMessage] = useState("");
  const [idCheck, setIdCheck] = useState(false);
  const [rePassword, setRePassword] = useState("");
  const [nickNameCheck, setNickNameCheck] = useState(false);
  const navigate = useNavigate();

  const emailRegEx =
    /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,8}$/;

  const passwordRegEx =
    /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,49}$/;

  function handleSaveClick() {
    if (!passwordRegEx.test(password) || password !== rePassword) {
      return;
    }

    axios
      .post("/api/member/signup", {
        memberId,
        password,
        name,
        nickname,
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
        params: { nickname },
      })
      .then((res) => res.data)
      .then((data) => {
        const message = data.message;
        toaster.create({
          type: message.type,
          description: message.text,
        });
        if (data.available) {
          setNickNameCheckMessage("사용 가능합니다.");
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

  let disabled = true;
  if (idCheck && nickNameCheck) {
    if (passwordRegEx.test(password) && password === rePassword) {
      disabled = false;
    }
  }

  let nickNameCheckButtonDisabled = nickname.length === 0;

  const passwordMatchText =
    rePassword.length === 0 ? (
      "비밀번호를 다시 입력하세요."
    ) : !passwordRegEx.test(rePassword) ? (
      <Text color="red.500">
        확인 비밀번호가 올바르지 않습니다. (영문, 숫자, 특수문자 포함, 8자 이상)
      </Text>
    ) : password === rePassword ? (
      <Text color="green.500">비밀번호가 일치합니다.</Text>
    ) : (
      <Text color="red.500">비밀번호가 일치하지 않습니다.</Text>
    );

  return (
    <Box>
      <h3>회원 가입</h3>
      <Stack gap={5}>
        <Field
          label={"아이디"}
          helperText={
            idCheckMessage && (
              <Text color={idCheck ? "green.500" : "red.500"}>
                {idCheckMessage}
              </Text>
            )
          }
        >
          <Group attached w={"100%"}>
            <Input
              value={memberId}
              placeholder="이메일을 입력하세요"
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
            placeholder="암호를 입력하세요"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </Field>

        <Field label={"암호확인"} helperText={passwordMatchText}>
          <Input
            placeholder="암호를 재입력하세요"
            value={rePassword}
            onChange={(e) => setRePassword(e.target.value)}
          />
        </Field>

        <Field
          label={"별명"}
          helperText={
            nickNameCheckMessage && (
              <Text color={nickNameCheck ? "green.500" : "red.500"}>
                {nickNameCheckMessage}
              </Text>
            )
          }
        >
          <Group attached w={"100%"}>
            <Input
              value={nickname}
              placeholder="별명을 입력하세요"
              onChange={(e) => {
                setNickName(e.target.value);
              }}
            />
            <Button
              onClick={handleNickNameCheckClick}
              variant={"outline"}
              disabled={nickNameCheckButtonDisabled}
            >
              중복확인
            </Button>
          </Group>
        </Field>

        <Button w={"100%"} onClick={handleSaveClick} disabled={disabled}>
          회원가입
        </Button>
      </Stack>
    </Box>
  );
}
