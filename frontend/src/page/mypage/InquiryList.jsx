import React, { useContext, useEffect, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Flex,
  Spinner,
  Table,
  TableColumnHeader,
  TableHeader,
  TableRow,
  Text,
} from "@chakra-ui/react";
import { FaCommentDots } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthenticationContext } from "../../components/context/AuthenticationProvider.jsx";

export function InquiryList({ onRowClick }) {
  const [inquiryList, setInquiryList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const { nickname } = useContext(AuthenticationContext);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  // 데이터 정렬 함수
  const sortInquiries = (inquiries) => {
    return inquiries.sort((a, b) => {
      const dateA = new Date(a.inserted);
      const dateB = new Date(b.inserted);
      return dateA - dateB || a.inquiryId - b.inquiryId; // 오래된 날짜, 작은 ID 우선 정렬
    });
  };

  // 문의 내역 데이터 로드
  useEffect(() => {
    const fetchInquiries = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/myPage/list");
        if (response.status === 200) {
          setInquiryList(sortInquiries(response.data));
        }
      } catch (error) {
        console.error("데이터를 불러오는 중 오류가 발생했습니다:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInquiries();
  }, []);

  // 페이지네이션 관련 데이터
  const totalPages = Math.ceil(inquiryList.length / itemsPerPage);
  const paginatedInquiries = inquiryList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // 페이지 변경 핸들러
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // 행 클릭 핸들러
  const handleRowClick = (inquiryId) => {
    localStorage.setItem("selectedInquiryId", inquiryId);
    navigate(`/myPage/${inquiryId}`);
  };

  // 로딩 상태
  if (loading) {
    return <Spinner />;
  }

  const cellStyle = {
    padding: "10px",
    height: "50px",
    textAlign: "center",
  };

  return (
    <Box mt="60px">
      <Text fontSize="2xl" fontWeight="bold" mt={-7} ml={5}>
        문의 내역
      </Text>
      <Box pt={4}>
        <Table.Root interactive>
          <TableHeader>
            <TableRow>
              <TableColumnHeader style={cellStyle}>번호</TableColumnHeader>
              <TableColumnHeader style={cellStyle}>문의 유형</TableColumnHeader>
              <TableColumnHeader style={cellStyle}>제목</TableColumnHeader>
              <TableColumnHeader style={cellStyle}>작성자</TableColumnHeader>
              <TableColumnHeader style={cellStyle}>작성 일자</TableColumnHeader>
              <TableColumnHeader style={cellStyle}>상태</TableColumnHeader>
            </TableRow>
          </TableHeader>
          <Table.Body>
            {paginatedInquiries.length > 0 ? (
              paginatedInquiries.map((inquiry) => (
                <Table.Row
                  key={inquiry.inquiryId}
                  onClick={() => handleRowClick(inquiry.inquiryId)}
                  style={{ cursor: "pointer", ...cellStyle }}
                >
                  <Table.Cell style={cellStyle}>{inquiry.inquiryId}</Table.Cell>
                  <Table.Cell style={cellStyle}>{inquiry.category}</Table.Cell>
                  <Table.Cell style={cellStyle}>{inquiry.title}</Table.Cell>
                  <Table.Cell style={cellStyle}>{nickname}</Table.Cell>
                  <Table.Cell style={cellStyle}>
                    {new Date(inquiry.inserted).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell style={cellStyle}>
                    <Badge
                      variant={"subtle"}
                      colorPalette={inquiry.hasAnswer ? "green" : "red"}
                    >
                      <FaCommentDots />{" "}
                      {inquiry.hasAnswer ? "답변 완료" : "답변 대기"}
                    </Badge>
                  </Table.Cell>
                </Table.Row>
              ))
            ) : (
              <Table.Row>
                <Table.Cell colSpan={6} style={{ textAlign: "center" }}>
                  문의 내역이 없습니다.
                </Table.Cell>
              </Table.Row>
            )}
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
