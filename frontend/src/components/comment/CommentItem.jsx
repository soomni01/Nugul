import { Box, Card, Flex, Heading, Textarea } from "@chakra-ui/react";
import { Button } from "../ui/button.jsx";
import { useContext, useState } from "react";
import {
  DialogActionTrigger,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog.jsx";
import { AuthenticationContext } from "../context/AuthenticationProvider.jsx";
import { CiEdit, CiSaveDown1, CiTrash } from "react-icons/ci";
import { FaUndo } from "react-icons/fa";

function DeleteButton({ onClick }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <DialogRoot open={open} onOpenChange={(e) => setOpen(e.open)}>
        <DialogTrigger asChild>
          <Button colorPalette={"red"} size={"sm"} variant={"subtle"}>
            <CiTrash />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>삭제 확인</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <p>댓글을 삭제하시겠습니까? </p>
          </DialogBody>
          <DialogFooter>
            <DialogActionTrigger>
              <Button variant={"outline"}>취소</Button>
            </DialogActionTrigger>
            <Button colorPalette={"red"} onClick={onClick}>
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>
    </>
  );
}

function EditButton({ isEditing, onSaveClick, onCancelClick, onEditClick }) {
  return (
    <>
      {!isEditing ? (
        <Button
          colorPalette={"purple"}
          size={"sm"}
          variant={"subtle"}
          onClick={onEditClick}
        >
          <CiEdit />
        </Button>
      ) : (
        <>
          <Button
            colorPalette={"purple"}
            size={"sm"}
            variant={"subtle"}
            onClick={onSaveClick}
          >
            저장
          </Button>
          <Button variant={"outline"} onClick={onCancelClick}>
            취소
          </Button>
        </>
      )}
    </>
  );
}

export function CommentItem({ comment, onDeleteClick, onEditClick }) {
  const { hasAccess } = useContext(AuthenticationContext);
  const [isEditing, setIsEditing] = useState(false);
  const [editedComment, setEditedComment] = useState(comment.comment);

  const handleSaveClick = () => {
    onEditClick(comment.commentId, editedComment); // 수정된 댓글을 부모로 전달
    setIsEditing(false); // 저장 후 수정 모드 종료
  };

  const handleCancelClick = () => {
    setEditedComment(comment.comment); // 원래 댓글로 되돌리기
    setIsEditing(false); // 수정 모드 종료
  };

  const handleEditClick = () => {
    setIsEditing(true); // 수정 모드로 전환
  };

  return (
    <Card.Root
      border={"1px solid black"}
      mt={5}
      maxWidth={"600px"} // 최대 너비를 설정
      width={"100%"} // 부모에 맞추되 최대값까지
      mx={"auto"} // 중앙 정렬 (가로 마진 auto)
      height={"auto"}
    >
      <Card.Header>
        <Flex justify={"space-between"}>
          <Heading size={"md"}>{comment.nickname}</Heading>
          <Heading size={"sm"}>{comment.inserted}</Heading>
        </Flex>
      </Card.Header>

      <Card.Body>
        {isEditing ? (
          <Textarea
            value={editedComment}
            onChange={(e) => setEditedComment(e.target.value)}
          />
        ) : (
          <Box css={{ whiteSpace: "pre" }}>{comment.comment}</Box>
        )}
      </Card.Body>

      {hasAccess(comment.memberId) && (
        <Card.Footer css={{ justifyContent: "flex-end" }}>
          {!isEditing ? (
            <>
              <EditButton
                isEditing={isEditing}
                onSaveClick={handleSaveClick}
                onCancelClick={handleCancelClick}
                onEditClick={handleEditClick}
              />
              <DeleteButton onClick={() => onDeleteClick(comment.commentId)} />
            </>
          ) : (
            <>
              <Button
                colorPalette={"purple"}
                size={"sm"}
                variant={"subtle"}
                onClick={handleSaveClick}
              >
                <CiSaveDown1 />
              </Button>
              <Button
                colorPalette={"red"}
                size={"sm"}
                variant={"subtle"}
                onClick={handleCancelClick}
              >
                <FaUndo />
              </Button>
            </>
          )}
        </Card.Footer>
      )}
    </Card.Root>
  );
}
