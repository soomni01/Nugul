import { Box, Heading, HStack, Icon, Stack, Text } from "@chakra-ui/react";
import { CommentInput } from "./CommentInput.jsx";
import { CommentList } from "./CommentList.jsx";
import { useEffect, useState } from "react";
import axios from "axios";
import { toaster } from "../ui/toaster.jsx";
import { useSearchParams } from "react-router-dom";
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "../ui/pagination.jsx";
import { FaCommentDots } from "react-icons/fa";

export function CommentContainer({ boardId }) {
  const [commentList, setCommentList] = useState([]);
  const [count, setCount] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const controller = new AbortController();
    if (!processing) {
      axios
        .get(`/api/comment/commentList/${boardId}`, {
          params: searchParams,
        })
        .then((res) => res.data)
        .then((data) => {
          setCommentList(data.list); // 댓글 리스트만 저장
          setCount(data.count); // 댓글 총 개수 저장
        });
      return () => {
        controller.abort();
      };
    }
  }, [processing, searchParams]);

  // searchParams
  console.log(searchParams.toString());
  // page 번호
  const pageParam = searchParams.get("page") ? searchParams.get("page") : "1";
  const page = Number(pageParam);

  function handlePageChange(e) {
    console.log(e.page);
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.set("page", e.page);
    setSearchParams(nextSearchParams);
  }

  function handleSaveClick(comment) {
    setProcessing(true);
    axios
      .post("/api/comment/commentAdd", {
        boardId: boardId,
        comment: comment,
      })
      .then((res) => res.data.message)
      .then((message) => {
        toaster.create({
          type: message.type,
          description: message.text,
        });
      })
      .finally(() => {
        setProcessing(false);
      });
  }

  function handleDeleteClick(commentId) {
    setProcessing(true);
    axios
      .delete(`/api/comment/remove/${commentId}`)
      .then((res) => res.data.message)
      .then((message) => {
        toaster.create({
          type: message.type,
          description: message.text,
        });
      })
      .finally(() => {
        setProcessing(false);
      });
  }

  function handleEditClick(commentId, comment) {
    setProcessing(true);
    axios
      .put(`/api/comment/commentEdit`, { commentId, comment })
      .finally(() => {
        setProcessing(false);
      })
      .then((res) => res.data.message)
      .then((message) => {
        toaster.create({
          type: message.type,
          description: message.text,
        });
      })
      .finally(() => {
        setProcessing(false);
      });
  }

  return (
    <Box>
      <Stack gap={5}>
        <HStack>
          <Heading fontSize={"2xl"}>댓글</Heading>

          <Text fontSize={"xl"}>
            <Icon>
              <FaCommentDots />
            </Icon>
          </Text>
          <Text fontSize={"xl"}>{commentList.length}</Text>
        </HStack>

        <CommentInput boardId={boardId} onSaveClick={handleSaveClick} />

        <CommentList
          boardId={boardId}
          commentList={commentList}
          onDeleteClick={handleDeleteClick}
          onEditClick={handleEditClick}
        />
        {/* 댓글이 있을 때만 페이징을 표시 */}
        {commentList.length > 0 && (
          <Box display="flex" justifyContent="center">
            <PaginationRoot
              onPageChange={handlePageChange}
              count={count}
              pageSize={10}
              page={page}
            >
              <HStack>
                <PaginationPrevTrigger />
                <PaginationItems />
                <PaginationNextTrigger />
              </HStack>
            </PaginationRoot>
          </Box>
        )}
      </Stack>
    </Box>
  );
}
