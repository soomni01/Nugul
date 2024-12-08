import {Box, Dialog, Flex, HStack, Textarea} from "@chakra-ui/react";
import {Button} from "../ui/button.jsx";
import {useContext, useState} from "react";
import {
    DialogActionTrigger,
    DialogBody,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogRoot,
    DialogTitle,
    DialogTrigger
} from "../ui/dialog.jsx";
import {AuthenticationContext} from "../context/AuthenticationProvider.jsx";

function DeleteButton({ onClick }) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <DialogRoot open={open} onOpenChange={(e) => setOpen(e.open)}>
                <DialogTrigger asChild>
                    <Button colorPalette={"red"}>삭제</Button>
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

function EditButton({ comment, onEditClick }) {
    const [open, setOpen] = useState(false);
    const [newComment, setNewComment] = useState(comment.comment);
    return (
        <>
            <DialogRoot open={open} onOpenChange={(e) => setOpen(e.open)}>
                <DialogTrigger asChild>
                    <Button colorPalette={"purple"}>수정</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>댓글 수정</DialogTitle>
                    </DialogHeader>
                    <DialogBody>
                        <Textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                        />
                    </DialogBody>
                    <DialogFooter>
                        <DialogActionTrigger>
                            <Button variant={"outline"}>취소</Button>
                        </DialogActionTrigger>
                        <Button
                            colorPalette={"purple"}
                            onClick={() => {
                                setOpen(false);
                                onEditClick(comment.commentId, newComment);
                            }}
                        >
                            수정
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </DialogRoot>
        </>
    );
}
export function CommentItem({ comment, onDeleteClick, onEditClick }) {
    const {hasAccess} = useContext(AuthenticationContext)
  return (
    <HStack border={"1px solid black"} m={5}>
        <Box flex={1}>
      <Flex justify={"space-between"}>
        <h3>{comment.nickname}</h3>
        <h4>{comment.inserted}</h4>
      </Flex>
            <Box css={{whiteSpace:"pre"}}>{comment.comment}</Box>
        </Box>
        {hasAccess(comment.memberId) && (
            <Box>
                <EditButton comment={comment} onEditClick={onEditClick} />

                <DeleteButton onClick={() => onDeleteClick(comment.commentId)} />
            </Box>
        )}
    </HStack>
  );
}
