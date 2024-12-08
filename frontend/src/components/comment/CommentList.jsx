import { Box, HStack } from "@chakra-ui/react";
import { CommentItem } from "./CommentItem.jsx";
import { PaginationRoot, PaginationPrevTrigger, PaginationNextTrigger, PaginationItems } from "../ui/pagination.jsx";

export function CommentList({
                                boardId,
                                commentList,
                                onDeleteClick,
                                onEditClick,
                                currentPage,
                                handlePageChange, // 부모로부터 페이지 변경 핸들러를 전달받음
                            }) {

    return (
        <Box>
            {commentList.map((comment) => (
                <CommentItem
                    key={comment.commentId}
                    comment={comment}
                    onDeleteClick={onDeleteClick}
                    onEditClick={onEditClick}
                />
            ))}
            <PaginationRoot
                count={1500} // 전체 아이템 수
                pageSize={10} // 한 페이지당 아이템 수
                page={currentPage} // 현재 페이지 번호
                onPageChange={handlePageChange} // 페이지 변경 핸들러
            >
                <HStack>
                    <PaginationPrevTrigger />
                    <PaginationItems />
                    <PaginationNextTrigger />
                </HStack>
            </PaginationRoot>
        </Box>
    );
}
