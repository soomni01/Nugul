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

  // 테이블 행 클릭시 회원정보보기로 이동
  function handleRowClick(memberId) {
    navigate(`/member/${memberId}`);
  }

  // 검색 처리: type에 맞춰 필터링
  const filteredMembers = memberList.filter((member) => {
    // memberId를 명시적으로 사용하여 일관성 있게 처리
    const memberId = member.memberId;

    // 회원 데이터에 'memberId'가 누락된 경우 처리
    if (!memberId) {
      console.error("회원 데이터에 'memberId'가 누락되었습니다:", member);
      return false;
    }

    // 검색어에 따라 필터링
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

  // 검색 조건 변경
  function handleSearchTypeChange(e) {
    setSearch({ ...search, type: e.target.value });
  }

  // 검색어 변경
  function handleSearchKeywordChange(e) {
    setSearch({ ...search, keyword: e.target.value });
  }

  // 회원 탈퇴 처리
  function handleDeleteMember(memberId) {
    if (window.confirm("정말로 이 회원을 탈퇴시키겠습니까?")) {
      axios
        .delete(`/api/member/${memberId}`)
        .then((response) => {
          alert("회원이 성공적으로 탈퇴되었습니다.");
          setMemberList((prevList) =>
            prevList.filter((member) => member.memberId !== memberId),
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

      {/* 회원 리스트 테이블 */}
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
                onClick={() => handleRowClick(member.memberId)}
                key={member.memberId}
              >
                <Table.Cell>{member.memberId}</Table.Cell>
                <Table.Cell>{member.name}</Table.Cell>
                <Table.Cell>{member.nickname}</Table.Cell>
                <Table.Cell>
                  {new Date(member.inserted).toLocaleDateString()}
                </Table.Cell>
                <Table.Cell>
                  <button
                    style={{
                      backgroundColor: "#F15F5F",
                      color: "white",
                      border: "none",
                      padding: "10px 20px",
                      borderRadius: "5px",
                      cursor: "pointer",
                      fontSize: "15px",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteMember(member.memberId);
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
