import { Box, Image, Input, Spinner, Stack, Textarea } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
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
import { toaster } from "../../components/ui/toaster.jsx";
import { AuthenticationContext } from "../../components/context/AuthenticationProvider.jsx";
import { CommentContainer } from "../../components/comment/CommentContainer.jsx";
import {
  BoardCategories,
  BoardCategoryContainer,
} from "../../components/board/BoardCategoryContainer.jsx";

export function ImageFileView({ files }) {
  return (
    <Box>
      {files.map((file) => (
        <Image
          key={file.name}
          src={file.src}
          w={"100%"}
          border={"1px solid black"}
          m={3}
        />
      ))}
    </Box>
  );
}

export function BoardView() {
  const { boardId } = useParams();
  const [board, setBoard] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all"); // 카테고리 상태 추가
  const navigate = useNavigate();
  const { hasAccess } = useContext(AuthenticationContext);

  useEffect(() => {
    axios.get(`/api/board/boardView/${boardId}`).then((res) => {
      setBoard(res.data);
      setSelectedCategory(res.data.category || "all"); // 게시물 카테고리 설정
    });
  }, [boardId]);

  if (!board) {
    return <Spinner />;
  }

  const handleDeleteClick = () => {
    axios
      .delete(`/api/board/boardDelete/${board.boardId}`)
      .then((res) => res.data)
      .then((data) => {
        toaster.create({
          type: data.message.type,
          description: data.message.text,
        });
        navigate("/board/list");
      })
      .catch((e) => {
        const data = e.response.data;
        toaster.create({
          type: data.message.type,
          description: data.message.text,
        });
      });
  };

  // 카테고리 선택 핸들러
  const handleCategorySelect = (categoryValue) => {
    setSelectedCategory(categoryValue); // 카테고리 상태 갱신
    navigate(`/board/list?category=${categoryValue}`); // 카테고리 변경 시 게시물 리스트로 이동
  };

  return (
    <Box>
      <h3>{boardId} 번 게시글</h3>

      {/* 카테고리 선택 */}
      <BoardCategoryContainer
        selectedCategory={selectedCategory} // 선택된 카테고리 상태 전달
        onCategorySelect={handleCategorySelect} // 카테고리 선택 함수 전달
      />

      <Stack gap={5}>
        <Field label="제목" readOnly>
          <Input value={board.title} />
        </Field>
        <Field label="본문" readOnly>
          <Textarea value={board.content} />
        </Field>
        <ImageFileView files={board.fileList} />
        <Field label="작성자" readOnly>
          <Input value={board.writer} />
        </Field>
        <Field label={"카테고리"} readOnly>
          <Input
            value={
              BoardCategories.find((cat) => cat.value === board.category)
                ?.label || ""
            }
          />
        </Field>
        <Field label={"작성날짜"} readOnly>
          <Input type={"date"} value={board.createdAt} />
        </Field>
        {hasAccess(board.memberId) && (
          <Box>
            <DialogRoot>
              <DialogTrigger asChild>
                <Button colorPalette={"red"} variant={"outline"}>
                  삭제
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>삭제 확인</DialogTitle>
                </DialogHeader>
                <DialogBody>
                  <p>{board.boardId}번 게시물을 삭제하시겠습니까?</p>
                </DialogBody>
                <DialogFooter>
                  <DialogActionTrigger>
                    <Button variant={"outline"}>취소</Button>
                  </DialogActionTrigger>
                  <Button colorPalette={"red"} onClick={handleDeleteClick}>
                    삭제
                  </Button>
                </DialogFooter>
              </DialogContent>
            </DialogRoot>
            <Button
              colorPalette={"cyan"}
              onClick={() => navigate(`/board/boardEdit/${board.boardId}`)}
            >
              수정
            </Button>
          </Box>
        )}
      </Stack>
      <hr />
      <CommentContainer boardId={board.boardId} />
    </Box>
  );
}
