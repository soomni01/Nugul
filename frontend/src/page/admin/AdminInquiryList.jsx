import {
  Badge,
  Box,
  Flex,
  Input,
  Table,
  TableColumnHeader,
  TableHeader,
  TableRow,
  Text,
} from "@chakra-ui/react";
import { FaCommentDots } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export function AdminInquiryList() {
  const [inquiryList, setInquiryList] = useState([]);
  const [search, setSearch] = useState({
    type: "all",
    keyword: "",
  });
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태
  const itemsPerPage = 10; // 페이지당 문의 수

  const navigate = useNavigate();

  // 1:1 문의 목록 요청 및 데이터 처리
  useEffect(() => {
    axios
      .get("/api/inquiry/list") // API 경로 수정
      .then((res) => {
        console.log("문의 목록 데이터:", res.data);
        setInquiryList(res.data);
      })
      .catch((error) => {
        console.error("문의 목록 요청 중 오류 발생:", error);
      });
  }, []);

  // 테이블 행 클릭 시 상세 페이지로 이동
  function handleRowClick(inquiryId) {
    navigate(`/admin/inquiries/${inquiryId}`);
  }

  // 검색 처리: type에 맞춰 필터링
  const filteredInquiries = inquiryList.filter((inquiry) => {
    const inquiryTitle = inquiry.title; // 문의 제목

    if (!inquiryTitle) {
      console.error("문의 데이터에 'title'이 누락되었습니다:", inquiry);
      return false;
    }

    const searchTerm = search.keyword.toLowerCase();
    switch (search.type) {
      case "all":
        return (
          inquiryTitle.toLowerCase().includes(searchTerm) ||
          inquiry.memberId.toLowerCase().includes(searchTerm)
        );
      case "title":
        return inquiryTitle.toLowerCase().includes(searchTerm);
      case "member":
        return inquiry.memberId.toLowerCase().includes(searchTerm);
      default:
        return false;
    }
  });

  // 페이지네이션 처리
  const totalPages = Math.ceil(filteredInquiries.length / itemsPerPage); // 전체 페이지 수
  const paginatedInquiries = filteredInquiries.slice(
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

  return (
    <Box mt="60px">
      <Text fontSize="2xl" fontWeight="bold" mb={5} m={2}>
        1:1 문의 관리
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
            <option value="title">제목</option>
            <option value="member">작성자</option>
            {/* 작성자 검색 옵션 */}
          </select>
        </Flex>
      </Box>
      <Text mb={4} m={2}>
        총 {filteredInquiries.length}개
      </Text>

      {/* 문의 리스트 테이블 */}
      <Box>
        <Table.Root interactive>
          <TableHeader>
            <TableRow>
              <TableColumnHeader>번호</TableColumnHeader>
              <TableColumnHeader>제목</TableColumnHeader>
              <TableColumnHeader>작성자</TableColumnHeader>
              <TableColumnHeader>작성 일자</TableColumnHeader>
              <TableColumnHeader>상태</TableColumnHeader>
            </TableRow>
          </TableHeader>
          <Table.Body>
            {paginatedInquiries.map((inquiry) => (
              <Table.Row
                onClick={() => handleRowClick(inquiry.inquiryId)}
                key={inquiry.inquiryId}
              >
                <Table.Cell>{inquiry.inquiryId}</Table.Cell>
                <Table.Cell>{inquiry.title}</Table.Cell>
                <Table.Cell>{inquiry.memberId}</Table.Cell>
                <Table.Cell>
                  {new Date(inquiry.inserted).toLocaleDateString()}{" "}
                </Table.Cell>
                <Table.Cell>
                  {inquiry.answer ? (
                    <Badge variant={"subtle"} colorPalette={"green"}>
                      <FaCommentDots /> 답변 완료
                    </Badge>
                  ) : (
                    <Badge variant={"subtle"} colorPalette={"red"}>
                      <FaCommentDots /> 답변 대기
                    </Badge>
                  )}
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
