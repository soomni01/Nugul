import React from "react";
import { Box, Button, Input } from "@chakra-ui/react";
import { IoClose } from "react-icons/io5";
import { Field } from "../ui/field.jsx";

export function ReviewModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="background">
      <div className="modal">
        <button className="close" onClick={onClose}>
          <IoClose />
        </button>
        <div className="content">
          <Box
            className="test"
            center={{ lat: 33.450701, lng: 126.570667 }}
            level={3}
            style={{ width: "100%", height: "400px" }}
          ></Box>
          <Field mt={5} label={"선택한 곳의 장소명을 입력해주세요"}>
            <Input
              value={"test"}
              onChange={(e) => {}}
              placeholder="예) 이대역 1번 출구, 롯데타워 앞"
            />
          </Field>
          <div className="button-container">
            <Button className="confirm-button">위치 설정</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
