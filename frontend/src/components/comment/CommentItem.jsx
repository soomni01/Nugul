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

function EditButton({ isEditing, onSaveClick, onCancelClick, onEditClick }) {
    return (
        <>
            {!isEditing ? (
                <Button colorPalette={"purple"} onClick={onEditClick}>
                    수정
                </Button>
            ) : (
                <>
                    <Button colorPalette={"purple"} onClick={onSaveClick}>
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
        <HStack border={"1px solid black"} m={5}>
            <Box flex={1}>
                <Flex justify={"space-between"}>
                    <h3>{comment.nickname}</h3>
                    <h4>{comment.inserted}</h4>
                </Flex>
                {/* 댓글 내용이 수정 중이면 Textarea, 아니면 그냥 텍스트를 표시 */}
                {isEditing ? (
                    <Textarea
                        value={editedComment}
                        onChange={(e) => setEditedComment(e.target.value)}
                    />
                ) : (
                    <Box css={{ whiteSpace: "pre" }}>{comment.comment}</Box>
                )}
            </Box>
            {hasAccess(comment.memberId) && (
                <Box>
                    {/* 기본 모드에서 수정, 삭제 버튼을 순서대로 표시 */}
                    {!isEditing && (
                        <>
                            <EditButton
                                isEditing={isEditing}
                                onSaveClick={handleSaveClick}
                                onCancelClick={handleCancelClick}
                                onEditClick={handleEditClick}
                            />
                            <DeleteButton onClick={() => onDeleteClick(comment.commentId)} />
                        </>
                    )}

                    {/* 수정 모드에서만 저장과 취소 버튼을 표시 */}
                    {isEditing && (
                        <>
                            <Button colorPalette={"purple"} onClick={handleSaveClick}>
                                저장
                            </Button>
                            <Button variant={"outline"} onClick={handleCancelClick}>
                                취소
                            </Button>
                        </>
                    )}
                </Box>
            )}
        </HStack>
    );
}
