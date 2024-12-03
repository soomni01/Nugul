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

export function AdminMemberList() {
  const [memberList, setMemberList] = useState([]);
  const [search, setSearch] = useState({
    type: "all",
    keyword: "",
  });
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태
  const itemsPerPage = 10; // 페이지당 회원 수

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/api/member/list")
      .then((res) => {
        console.log("회원 목록 데이터:", res.data);
        setMemberList(res.data);
      })
      .catch((error) => {
        console.error("회원 목록 요청 중 오류 발생:", error);
      });
  }, []);

  const filteredMembers = memberList.filter((member) => {
    const memberId = member.memberId;

    if (!memberId) {
      console.error("회원 데이터에 'memberId'가 누락되었습니다:", member);
      return false;
    }

    const searchTerm = search.keyword.toLowerCase();
    switch (search.type) {
      case "all":
        return (
          memberId.toString().includes(searchTerm) ||
          member.name.toLowerCase().includes(searchTerm) ||
          member.nickname.toLowerCase().includes(searchTerm)
        );
      case "id":
        return memberId.toString().includes(searchTerm);
      case "name":
        return member.name.toLowerCase().includes(searchTerm);
      case "nickname":
        return member.nickname.toLowerCase().includes(searchTerm);
      default:
        return false;
    }
  });

  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage); // 전체 페이지 수
  const paginatedMembers = filteredMembers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  function handlePageChange(newPage) {
    setCurrentPage(newPage);
  }

  function handleSearchTypeChange(e) {
    setSearch({ ...search, type: e.target.value });
    setCurrentPage(1);
  }

  function handleSearchKeywordChange(e) {
    setSearch({ ...search, keyword: e.target.value });
    setCurrentPage(1);
  }

  function handleDeleteClick(memberId, password, nickname, inserted) {
    axios
      .delete("/api/member/remove", {
        data: { memberId, password, nickname, inserted },
      })
      .then((res) => {
        toaster.create({
          type: "success",
          description: "회원 탈퇴가 완료되었습니다.",
        });
        console.log("응답 데이터:", res.data);
        navigate("/admin/members");
      })
      .catch((error) => {
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
              <TableColumnHeader>가입 일자</TableColumnHeader>
              <TableColumnHeader>회원 탈퇴</TableColumnHeader>
            </TableRow>
          </TableHeader>
          <Table.Body>
            {paginatedMembers.map((member) => (
              <Table.Row key={member.memberId}>
                <Table.Cell>{member.memberId}</Table.Cell>
                <Table.Cell>{member.nickname}</Table.Cell>
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

      {/* 페이지 버튼 */}
      <Flex justify="center" mt={4} gap={2}>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
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
          </button>
        ))}
      </Flex>
    </Box>
  );
}
