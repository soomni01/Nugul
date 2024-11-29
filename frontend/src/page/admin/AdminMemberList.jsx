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

function DeleteButton({ onClick, id: memberId }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <DialogRoot open={open} onOpenChange={(e) => setOpen(e.open)}>
        <DialogTrigger asChild>
          <Button colorPalette={"red"}>탈퇴</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>탈퇴 확인</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <Stack gap={5}>
              <Field label={"암호"}>
                <Input placeholder={"암호를 입력해주세요."} />
              </Field>
            </Stack>
          </DialogBody>
          <DialogFooter>
            <DialogActionTrigger>
              <Button variant={"outline"} onClick={() => setOpen(false)}>
                취소
              </Button>
            </DialogActionTrigger>
            <Button
              colorPalette={"red"}
              onClick={() => {
                // 탈퇴 로직을 수행 후 다이얼로그 닫기
                onClick(memberId);
                setOpen(false);
              }}
            >
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

  // 회원 목록 요청 및 데이터 처리
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

  // 테이블 행 클릭시 회원정보 보기로 이동
  // function handleRowClick(memberId) {
  //   navigate(`/member/${memberId}`);
  // }

  // 검색 처리: type에 맞춰 필터링
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

  // 페이지네이션 처리
  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage); // 전체 페이지 수
  const paginatedMembers = filteredMembers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  function handlePageChange(newPage) {
    setCurrentPage(newPage);
  }

  // 검색 조건 변경
  function handleSearchTypeChange(e) {
    setSearch({ ...search, type: e.target.value });
    setCurrentPage(1); // 검색 시 첫 페이지로 이동
  }

  // 검색어 변경
  function handleSearchKeywordChange(e) {
    setSearch({ ...search, keyword: e.target.value });
    setCurrentPage(1); // 검색 시 첫 페이지로 이동
  }

  function handleDeleteClick(memberId) {
    axios
      .delete(`/api/member/delete/${memberId}`)
      .then((res) => {
        alert(res.data); // 백엔드에서 반환된 메시지를 표시
        console.log("응답 데이터:", res.data);
        // 탈퇴 후 멤버 리스트 페이지로 이동
        navigate("/member/list");
      })
      .catch((error) => {
        console.error("회원 탈퇴 요청 중 오류 발생:", error);
        alert("회원 탈퇴에 실패했습니다. 다시 시도해주세요.");
      })
      .finally(() => {
        // setOpen(false);
      });
  }

  // 버튼 클릭 시 호출되는 함수
  function handleDeleteMember(memberId) {
    handleDeleteClick(memberId);
  }

  return (
    <Box mt="60px">
      <Text fontSize="2xl" fontWeight="bold" mb={5} m={2}>
        회원 관리
      </Text>

      {/* 검색 박스 */}
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
            <option value="name">이름</option>
            <option value="nickname">닉네임</option>
          </select>
        </Flex>
      </Box>
      <Text mb={4} m={2}>
        총 {filteredMembers.length}명
      </Text>

      {/* 회원 리스트 테이블 */}
      <Box>
        <Table.Root interactive>
          <TableHeader>
            <TableRow>
              <TableColumnHeader>ID</TableColumnHeader>
              <TableColumnHeader>이름</TableColumnHeader>
              <TableColumnHeader>닉네임</TableColumnHeader>
              <TableColumnHeader>가입 일자</TableColumnHeader>
              <TableColumnHeader>탈퇴</TableColumnHeader>
            </TableRow>
          </TableHeader>
          <Table.Body>
            {paginatedMembers.map((member) => (
              <Table.Row
                // onClick={() => handleRowClick(member.memberId)}
                key={member.memberId}
              >
                <Table.Cell>{member.memberId}</Table.Cell>
                <Table.Cell>{member.name}</Table.Cell>
                <Table.Cell>{member.nickname}</Table.Cell>
                <Table.Cell>
                  {new Date(member.inserted).toLocaleDateString()}
                </Table.Cell>
                <Table.Cell>
                  {/*<Button*/}
                  {/*  style={{*/}
                  {/*    backgroundColor: "#F15F5F",*/}
                  {/*    color: "white",*/}
                  {/*    border: "none",*/}
                  {/*    padding: "10px 20px",*/}
                  {/*    borderRadius: "5px",*/}
                  {/*    cursor: "pointer",*/}
                  {/*    fontSize: "15px",*/}
                  {/*  }}*/}
                  {/*  onClick={() => handleDeleteClick(member.memberId)} // 클릭 시 memberId를 넘겨서 호출*/}
                  {/*>*/}
                  {/*  탈퇴*/}
                  {/*</Button>*/}
                  <DeleteButton
                    onClick={handleDeleteClick}
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
