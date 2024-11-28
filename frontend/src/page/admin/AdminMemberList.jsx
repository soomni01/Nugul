import {
  Box,
  Flex,
  Input,
  Table,
  TableColumnHeader,
  TableHeader,
  TableRow,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export function AdminMemberList() {
  const [memberList, setMemberList] = useState([]);
  const [search, setSearch] = useState({
    type: "all",
    keyword: "",
  });
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

  // 테이블 행 클릭시 회원정보보기로 이동
  function handleRowClick(id) {
    navigate(`/member/${id}`);
  }

  const filteredMembers = memberList.filter((member) => {
    const memberId = member.member_id || member.id; // 'member_id'가 없으면 'id'를 사용

    if (!memberId) {
      console.error("회원 데이터에 'member_id'가 누락되었습니다:", member);
      return false;
    }

    if (search.type === "all") {
      return (
        memberId.toString().includes(search.keyword) ||
        member.name.toLowerCase().includes(search.keyword.toLowerCase()) ||
        member.nickname.toLowerCase().includes(search.keyword.toLowerCase())
      );
    } else {
      return (
        member[search.type] ? member[search.type].toString().toLowerCase() : ""
      ).includes(search.keyword.toLowerCase());
    }
  });

  function handleSearchTypeChange(e) {
    setSearch({ ...search, type: e.target.value });
  }

  function handleSearchKeywordChange(e) {
    setSearch({ ...search, keyword: e.target.value });
  }

  function handleDeleteMember(id) {
    if (window.confirm("정말로 이 회원을 탈퇴시키겠습니까?")) {
      axios
        .delete(`/api/member/${id}`)
        .then((response) => {
          alert("회원이 성공적으로 탈퇴되었습니다.");
          setMemberList((prevList) =>
            prevList.filter((member) => member.id !== id),
          );
        })
        .catch((error) => {
          console.error("탈퇴 처리 중 오류가 발생했습니다:", error);
          alert("탈퇴 처리에 실패했습니다. 다시 시도해 주세요.");
        });
    }
  }

  return (
    <Box mt="60px">
      <Text fontSize="2xl" fontWeight="bold" mb={5}>
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

      {/* 회원 리스트 박스 */}
      <Box>
        <Table.Root interactive>
          <TableHeader>
            <TableRow>
              <TableColumnHeader>ID</TableColumnHeader>
              <TableColumnHeader>Name</TableColumnHeader>
              <TableColumnHeader>Nickname</TableColumnHeader>
              <TableColumnHeader>Inserted</TableColumnHeader>
              <TableColumnHeader>Delete</TableColumnHeader>
            </TableRow>
          </TableHeader>
          <Table.Body>
            {filteredMembers.map((member) => (
              <Table.Row
                onClick={() => handleRowClick(member.id)}
                key={member.id}
              >
                <Table.Cell>{member.id}</Table.Cell>
                <Table.Cell>{member.name}</Table.Cell>
                <Table.Cell>{member.nickname}</Table.Cell>
                <Table.Cell>{member.inserted}</Table.Cell>
                <Table.Cell>
                  <button
                    style={{
                      backgroundColor: "#F15F5F", // 빨간색 배경
                      color: "white", // 흰색 글씨
                      border: "none",
                      padding: "10px 20px",
                      borderRadius: "5px",
                      cursor: "pointer",
                      fontSize: "15px",
                    }}
                    onClick={(e) => {
                      e.stopPropagation(); // 클릭 이벤트가 행 클릭으로 전파되지 않도록 방지
                      handleDeleteMember(member.id);
                    }}
                  >
                    탈퇴
                  </button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Box>
    </Box>
  );
}
