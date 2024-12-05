import {
  Box,
  Flex,
  Input,
  Stack,
  Table,
  TableColumnHeader,
  TableHeader,
  TableRow,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "../../components/ui/button.jsx";
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
import { Field } from "../../components/ui/field.jsx";
import { toaster } from "../../components/ui/toaster.jsx";

// 회원 삭제를 위한 버튼과 비밀번호 입력 및 확인을 관리하는 역할
function DeleteButton({ memberId, onDelete }) {
  const [password, setPassword] = useState("");
  const [open, setOpen] = useState(false);

  function handleDeleteClick() {
    if (password.trim() === "") {
      toaster.create({
        type: "error",
        description: "비밀번호를 입력해 주세요.",
      });
      return;
    }
    onDelete(memberId, password);
    setOpen(false);
  }

  return (
    <>
      <DialogRoot open={open} onOpenChange={(e) => setOpen(e.open)}>
        <DialogTrigger asChild>
          <Button colorPalette={"red"}>탈퇴</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader ml={0.5}>
            <DialogTitle>탈퇴 확인</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <Stack gap={5}>
              <Field>
                <Input
                  type="password"
                  placeholder={"관리자 비밀번호를 입력해 주세요."}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Field>
            </Stack>
          </DialogBody>
          <DialogFooter>
            <DialogActionTrigger>
              <Button variant={"outline"} onClick={() => setOpen(false)}>
                취소
              </Button>
            </DialogActionTrigger>
            <Button colorPalette={"red"} onClick={handleDeleteClick}>
              탈퇴
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>
    </>
  );
}

// 관리자 페이지에서 회원 목록을 조회, 검색, 페이징 처리 및 회원 삭제를 관리
export function AdminMemberList() {
  const [memberList, setMemberList] = useState([]);
  const [search, setSearch] = useState({
    type: "all",
    keyword: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const navigate = useNavigate();

  // 컴포넌트가 처음 렌더링될 때 회원 목록 데이터를 가져오고, 가입 날짜 기준으로 정렬함
  useEffect(() => {
    axios
      .get("/api/member/list")
      .then((res) => {
        // 회원 데이터를 'inserted' 날짜 기준으로 오름차순 정렬 후 상태에 저장
        const sortedMembers = res.data.sort((a, b) => {
          const dateA = new Date(a.inserted);
          const dateB = new Date(b.inserted);
          return dateA - dateB;
        });
        setMemberList(sortedMembers);
      })
      .catch((error) => {
        console.error("회원 목록 요청 중 오류 발생:", error);
      });
  }, []);

  // 검색 조건과 키워드에 따라 회원 목록을 필터링함
  const filteredMembers = memberList.filter((member) => {
    const searchTerm = search.keyword.toLowerCase();

    switch (search.type) {
      case "all":
        return (
          member.memberId?.toString().toLowerCase().includes(searchTerm) ||
          member.nickname?.toLowerCase().includes(searchTerm)
        );
      case "id":
        return member.memberId?.toString().toLowerCase().includes(searchTerm);
      case "nickname":
        return member.nickname?.toLowerCase().includes(searchTerm);
      default:
        return false;
    }
  });

  // 필터링된 회원 목록을 페이지네이션함
  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
  const paginatedMembers = filteredMembers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // 페이지 변경 시 현재 페이지를 업데이함
  function handlePageChange(newPage) {
    setCurrentPage(newPage);
  }

  // 검색 유형 변경 시 검색 상태를 업데이트하고 첫 페이지로 이동함
  function handleSearchTypeChange(e) {
    setSearch({ ...search, type: e.target.value });
    setCurrentPage(1);
  }

  // 검색 키워드 변경 시 검색 상태를 업데이트하고 첫 페이지로 이동함
  function handleSearchKeywordChange(e) {
    setSearch({ ...search, keyword: e.target.value });
    setCurrentPage(1);
  }

  // 회원 삭제 요청: 관리자 비밀번호 확인 후 해당 회원을 삭제함
  function handleDeleteClick(memberId, password) {
    axios
      .delete("/api/member/remove", {
        data: { memberId, password },
      })
      .then(() => {
        // 회원 삭제 후 목록에서 해당 회원 제거
        toaster.create({
          type: "success",
          description: "회원 탈퇴가 완료되었습니다.",
        });
        setMemberList((prev) =>
          prev.filter((member) => member.memberId !== memberId),
        );
      })
      .catch((error) => {
        // 비밀번호 불일치 시 에러 메시지 표시
        toaster.create({
          type: "error",
          description: "입력하신 관리자 비밀번호가 일치하지 않습니다.",
        });
        console.error("회원 탈퇴 요청 오류:", error);
      });
  }

  return (
    <Box mt="60px">
      <Text fontSize="2xl" fontWeight="bold" mb={5} m={2}>
        회원 관리
      </Text>
      <Box mb={3}>
        <Flex justify="center" align="center" gap={4}>
          <Input
            placeholder="검색"
            value={search.keyword}
            onChange={handleSearchKeywordChange}
            width="100%"
            maxWidth="800px"
          />
          <select value={search.type} onChange={handleSearchTypeChange}>
            <option value="all">전체</option>
            <option value="id">ID</option>
            <option value="nickname">닉네임</option>
          </select>
        </Flex>
      </Box>
      <Text mb={4} m={2}>
        총 {filteredMembers.length}명
      </Text>
      <Box>
        <Table.Root interactive>
          <TableHeader>
            <TableRow>
              <TableColumnHeader>ID</TableColumnHeader>
              <TableColumnHeader>닉네임</TableColumnHeader>
              <TableColumnHeader>비밀번호</TableColumnHeader>
              <TableColumnHeader>가입 일자</TableColumnHeader>
              <TableColumnHeader>회원 탈퇴</TableColumnHeader>
            </TableRow>
          </TableHeader>
          <Table.Body>
            {paginatedMembers.map((member) => (
              <Table.Row
                key={member.memberId}
                onClick={() =>
                  navigate(`/admin/members/${member.memberId}/detail`)
                }
              >
                <Table.Cell>{member.memberId}</Table.Cell>
                <Table.Cell>{member.nickname}</Table.Cell>
                <Table.Cell>{member.password}</Table.Cell>
                <Table.Cell>
                  {new Date(member.inserted).toLocaleDateString()}
                </Table.Cell>
                <Table.Cell>
                  <DeleteButton
                    onDelete={handleDeleteClick}
                    memberId={member.memberId}
                  />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Box>
      <Flex justify="center" mt={4} gap={2}>
        {Array.from({ length: totalPages }, (_, index) => (
          <Button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            style={{
              padding: "5px 10px",
              backgroundColor:
                currentPage === index + 1 ? "#D2D2D2" : "#E4E4E4",
              color: currentPage === index + 1 ? "white" : "black",
              border: "none",
              borderRadius: "3px",
              cursor: "pointer",
            }}
          >
            {index + 1}
          </Button>
        ))}
      </Flex>
    </Box>
  );
}
