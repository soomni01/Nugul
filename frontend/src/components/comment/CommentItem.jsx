import { Box, Flex, Heading, Textarea } from "@chakra-ui/react";
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
import { CiEdit, CiTrash } from "react-icons/ci";
import { useTheme } from "../context/ThemeProvider.jsx";

function DeleteButton({ onClick }) {
  const [open, setOpen] = useState(false);
  const { fontColor, buttonColor } = useTheme();

  return (
    <>
      <DialogRoot open={open} onOpenChange={(e) => setOpen(e.open)}>
        <DialogTrigger asChild>
          <Button
            color={fontColor}
            fontWeight="bold"
            bg={buttonColor}
            style={{ filter: "brightness(85%)" }}
            size={"sm"}
            variant={"subtle"}
          >
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
            <Button
              color={fontColor}
              fontWeight="bold"
              bg={buttonColor}
              _hover={{ bg: `${buttonColor}AA` }}
              onClick={onClick}
            >
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>
    </>
  );
}

function EditButton({ isEditing, onSaveClick, onCancelClick, onEditClick }) {
  const { buttonColor, fontColor } = useTheme();
  return (
    <>
      {!isEditing ? (
        <Button
          fontWeight="bold"
          bg={`${buttonColor}AA`}
          style={{ filter: "brightness(120%)" }}
          _hover={{ bg: `${buttonColor}AA` }}
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
          <Button variant={"outline"} size={"sm"} onClick={onCancelClick}>
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

  function formatDate(dateString) {
    return dateString.split("T")[0]; // "T"를 기준으로 날짜만 추출
  }

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      p={2}
      mt={5}
      Width="100%"
      mx="auto"
      bg="white"
      shadow="sm"
    >
      <Flex
        justify="space-between"
        mb={3}
        pb={0}
        borderBottom="1px solid"
        borderColor="gray.200"
        width="calc(100% + 18px)" // 부모 패딩 보정
        height={"40px"}
        bg="gray.100"
        ml="-9px" // 부모 좌측 패딩 보정
        mt={"-8px"}
        borderTopRadius="lg"
        alignItems="center" // 수직 중앙 정렬
      >
        <Flex align="center" ml={3}>
          <Heading size="md">{comment.nickname}</Heading>
          <Heading size="md" color="gray.500" ml={2}>
            {formatDate(comment.inserted)}
          </Heading>
        </Flex>
      </Flex>
      {isEditing ? (
        <Textarea
          value={editedComment}
          onChange={(e) => setEditedComment(e.target.value)}
          mb={2}
        />
      ) : (
        <Box whiteSpace="pre-line" mb={2}>
          {comment.comment}
        </Box>
      )}
      {hasAccess(comment.memberId) && (
        <Flex justify="flex-end" gap={2}>
          <EditButton
            isEditing={isEditing}
            onSaveClick={handleSaveClick}
            onCancelClick={handleCancelClick}
            onEditClick={handleEditClick}
          />
          {!isEditing && (
            <DeleteButton onClick={() => onDeleteClick(comment.commentId)} />
          )}
        </Flex>
      )}
    </Box>
  );
}
