import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog.jsx";
import { Button, DialogActionTrigger } from "@chakra-ui/react";
import { CiLogout } from "react-icons/ci";
import React from "react";

export function DialogCompo({ roomId, onDelete }) {
  return (
    <DialogRoot>
      <DialogTrigger asChild>
        <Button variant="outline">
          <CiLogout />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle> 채팅방을 나가기</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <p> 채팅 방을 나가실 경우 , 보낸 메시지기록이 전부 사라집니다.</p>
        </DialogBody>
        <DialogFooter>
          <DialogActionTrigger asChild>
            <Button variant="outline">취소</Button>
          </DialogActionTrigger>
          <Button onClick={onDelete} colorPalette={"red"}>
            나가기
          </Button>
        </DialogFooter>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  );
}
