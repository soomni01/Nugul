import { Box, Input, Spinner, Stack } from "@chakra-ui/react";
import { Field } from "../../components/ui/field.jsx";
import { useContext, useEffect, useState } from "react";
import { AuthenticationContext } from "../../components/context/AuthenticationProvider.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
import { toaster } from "../../components/ui/toaster.jsx";
import { kakaoUnlink } from "../../components/social/KakaoLogin.jsx";
import { naverUnlink } from "../../components/social/NaverLogin.jsx";

// 카카오 계정 연결 해제 함수 추가

export function Profile({ onEditClick }) {
  const [member, setMember] = useState(null);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState(""); // 이메일 상태 추가
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { id } = useContext(AuthenticationContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      return;
    }
    setLoading(true);

    axios
      .get(`/api/member/${id}`)
      .then((res) => setMember(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleDeleteClick() {
    try {
      // 서버 회원 삭제 요청
      const response = await axios.delete("/api/member/remove", {
        data: { memberId: id, password },
      });

      // 카카오 계정 로그아웃 및 연결 해제
      let kakaoUnlinked = false;
      let naverUnlinked = false;

      if (sessionStorage.getItem("kakaoAccessToken")) {
        await kakaoUnlink(); // 연결 해제
        console.log("카카오 계정 연결 해제 성공");
        sessionStorage.removeItem("kakaoAccessToken");
        kakaoUnlinked = true;
      }

      if (sessionStorage.getItem("naverAccessToken")) {
        // 네이버 계정 로그아웃 처리
        await naverUnlink();
        console.log("네이버 계정 연결 해제 성공");
        sessionStorage.removeItem("naverAccessToken");
        naverUnlinked = true;
      }

      // 성공 메시지
      if (response.data.message.type === "success") {
        const message = response.data.message;
        toaster.create({
          type: message.type,
          description: message.text,
        });
        localStorage.removeItem("token");
        navigate("/"); // 회원가입 페이지로 이동
      } else {
        throw new Error("연동 해제 실패");
      }
    } catch (error) {
      console.error(error);
      const message = error.response?.data?.message || {
        type: "error",
        text: "회원 탈퇴 중 오류가 발생했습니다.",
      };
      toaster.create({
        type: message.type,
        description: message.text,
      });
    } finally {
      setOpen(false);
      setPassword("");
      setEmail("");
    }
  }

  if (loading || !id || !member) {
    return <Spinner />;
  }

  return (
    <Box>
      <h3>회원 정보</h3>
      <Stack gap={5}>
        <Field label={"아이디"}>
          <Input readOnly value={id} />
        </Field>
        {member.password && (
          <Field label={"암호"}>
            <Input readOnly value={member.password} />
          </Field>
        )}
        <Field label={"별명"}>
          <Input readOnly value={member.nickname} />
        </Field>
        <Field label={"가입일시"}>
          <Input type={"date"} readOnly value={member.inserted.split("T")[0]} />
        </Field>
        <Box>
          <Button onClick={onEditClick}>수정</Button>
          <DialogRoot open={open} onOpenChange={(e) => setOpen(e.open)}>
            <DialogTrigger asChild>
              <Button colorPalette={"red"}>탈퇴</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>탈퇴 확인</DialogTitle>
              </DialogHeader>
              <DialogBody>
                <Stack gap={5}>
                  {member.password ? (
                    <Field label={"암호"}>
                      <Input
                        placeholder={"암호를 입력해주세요."}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </Field>
                  ) : (
                    <Field label={"이메일"}>
                      <Input
                        placeholder={"이메일을 입력해주세요."}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </Field>
                  )}
                </Stack>
              </DialogBody>
              <DialogFooter>
                <DialogActionTrigger>
                  <Button variant={"outline"}>취소</Button>
                </DialogActionTrigger>
                <Button colorPalette={"red"} onClick={handleDeleteClick}>
                  탈퇴
                </Button>
              </DialogFooter>
            </DialogContent>
          </DialogRoot>
        </Box>
      </Stack>
    </Box>
  );
}
