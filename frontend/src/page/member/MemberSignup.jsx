import { useState } from "react";
import { Box, Flex, Group, Input, Stack, Text } from "@chakra-ui/react";
import { Field } from "../../components/ui/field.jsx";
import { Button } from "../../components/ui/button.jsx";
import axios from "axios";
import { toaster } from "../../components/ui/toaster.jsx";
import { Link, useNavigate } from "react-router-dom";
import { TbLock, TbLockCheck } from "react-icons/tb";
import { FaRegUser } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";

export function MemberSignup() {
  const [memberId, setMemberId] = useState("");
  const [idCheckMessage, setIdCheckMessage] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickName] = useState("");
  const [nicknameCheckMessage, setNickNameCheckMessage] = useState("");
  const [idCheck, setIdCheck] = useState(false);
  const [rePassword, setRePassword] = useState("");
  const [nicknameCheck, setNickNameCheck] = useState(false);
  const navigate = useNavigate();

  const emailRegEx =
    /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,8}$/;

  const passwordRegEx =
    /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,49}$/;

  const handleLoginClick = () => {
    navigate("/");
  };

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
  if (idCheck && nicknameCheck) {
    if (passwordRegEx.test(password) && password === rePassword) {
      disabled = false;
    }
  }

  let nicknameCheckButtonDisabled = nickname.length === 0;

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="100vh"
    >
      <Box
        p={10}
        borderRadius="xl"
        minWidth="400px"
        maxWidth="500px"
        margin="0 auto"
      >
        <Text
          fontSize="2xl"
          fontWeight="bold"
          justifyContent="center"
          display="flex"
          mb={8}
        >
          회원가입
        </Text>
        <Stack gap={5}>
          <Field
            helperText={
              idCheckMessage && (
                <Text color={idCheck ? "green.500" : "red.500"}>
                  {idCheckMessage}
                </Text>
              )
            }
          >
            <Group attached w={"100%"}>
              <Button
                variant={"outline"}
                _hover={{ bg: "transparent" }}
                size={"xl"}
                cursor={"default"}
              >
                <MdOutlineEmail />
              </Button>
              <Group>
                <Input
                  size={"xl"}
                  value={memberId}
                  placeholder="이메일"
                  onChange={(e) => {
                    setIdCheck(false);
                    setMemberId(e.target.value);
                    setIdCheckMessage("");
                  }}
                />
                <Button
                  size={"xl"}
                  onClick={handleIdCheckClick}
                  variant={"outline"}
                >
                  중복 확인
                </Button>
              </Group>
            </Group>
          </Field>

          <Field
            helperText={
              password &&
              (passwordRegEx.test(password) ? (
                <Text color="green.500" mt={1}>
                  비밀번호가 올바른 형식입니다.
                </Text>
              ) : (
                <Text color="red.500" mt={1}>
                  비밀번호 형식이 올바르지 않습니다. (영문, 숫자, 특수문자 포함,
                  8자 이상)
                </Text>
              ))
            }
          >
            <Group attached w={"100%"}>
              <Button
                variant={"outline"}
                _hover={{ bg: "transparent" }}
                size={"xl"}
                cursor={"default"}
              >
                <TbLock />
              </Button>
              <Input
                size={"xl"}
                type="password"
                value={password}
                placeholder="비밀번호"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </Group>
          </Field>

          <Field
            helperText={
              rePassword &&
              (password === rePassword ? (
                <Text color="green.500" mt={1}>
                  비밀번호가 일치합니다.
                </Text>
              ) : (
                <Text color="red.500" mt={1}>
                  비밀번호가 일치하지 않습니다.
                </Text>
              ))
            }
          >
            <Group attached w={"100%"}>
              <Button
                variant={"outline"}
                _hover={{ bg: "transparent" }}
                size={"xl"}
                cursor={"default"}
              >
                <TbLockCheck />
              </Button>
              <Input
                size={"xl"}
                type="password"
                placeholder="비밀번호 확인"
                value={rePassword}
                onChange={(e) => setRePassword(e.target.value)}
              />
            </Group>
          </Field>

          <Field
            helperText={
              nicknameCheckMessage && (
                <Text color={nicknameCheck ? "green.500" : "red.500"}>
                  {nicknameCheckMessage}
                </Text>
              )
            }
          >
            <Group attached w={"100%"}>
              <Button
                variant={"outline"}
                _hover={{ bg: "transparent" }}
                size={"xl"}
                cursor={"default"}
              >
                <FaRegUser />
              </Button>
              <Group>
                <Input
                  size={"xl"}
                  value={nickname}
                  placeholder="닉네임"
                  onChange={(e) => {
                    setNickName(e.target.value);
                  }}
                />

                <Button
                  size={"xl"}
                  onClick={handleNickNameCheckClick}
                  variant={"outline"}
                  disabled={nicknameCheckButtonDisabled}
                >
                  중복 확인
                </Button>
              </Group>
            </Group>
          </Field>
        </Stack>
        <Flex justifyContent="center" gap={4} mt={10}>
          <Button onClick={handleSaveClick} disabled={disabled} w={"100%"}>
            회원가입
          </Button>
        </Flex>
        <Box textAlign="end" mt={3}>
          <Link to="/">로그인</Link>
        </Box>
      </Box>
    </Box>
  );
}
