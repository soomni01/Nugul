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
    // 회원 목록을 가져오는 예시 데이터 로드 로직 (실제 API 호출로 교체 필요)
    setMemberList([
      {
        id: "test@naver.com",
        name: "John Doe",
        nickname: "johndoe",
        inserted: "2023-11-27",
      },
      {
        id: "fly1043@naver.com",
        name: "Jane Smith",
        nickname: "janes",
        inserted: "2023-11-26",
      },
      {
        id: "mk@naver.com",
        name: "Coogie",
        nickname: "coogie",
        inserted: "2023-11-26",
      },
    ]);
  }, []);

  function handleRowClick(id) {
    navigate(`/member/${id}`);
  }

  // 검색어에 따라 필터링된 멤버 리스트 반환
  const filteredMembers = memberList.filter((member) => {
    if (search.type === "all") {
      return (
        member.id.toString().includes(search.keyword) ||
        member.name.toLowerCase().includes(search.keyword.toLowerCase()) ||
        member.nickname.toLowerCase().includes(search.keyword.toLowerCase())
      );
    } else {
      return member[search.type]
        .toString()
        .toLowerCase()
        .includes(search.keyword.toLowerCase());
    }
  });

  function handleSearchTypeChange(e) {
    setSearch({ ...search, type: e.target.value });
  }

  function handleSearchKeywordChange(e) {
    setSearch({ ...search, keyword: e.target.value });
  }

  function handleDeleteMember(id) {
    // 사용자가 탈퇴를 확인할 수 있도록 경고 창을 표시합니다.
    if (window.confirm("정말로 이 회원을 탈퇴시키겠습니까?")) {
      // 회원 탈퇴를 위한 API 호출을 여기에서 처리할 수 있습니다.
      axios
        .delete(`/api/member/${memberId}`)
        .then((response) => {
          alert("회원이 성공적으로 탈퇴되었습니다.");
          // 회원 리스트에서 탈퇴된 회원을 제거하기 위해 상태 업데이트
          setMemberList((prevList) =>
            prevList.filter((member) => member.id !== memberId),
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
                    onClick={() => handleDeleteMember(member.id)}
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
