import React, { useEffect, useState } from "react";
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

const InquiryList = ({ onRowClick }) => {
  const [inquiryList, setInquiryList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 5;
  const navigate = useNavigate();

  // 컴포넌트가 마운트될 때 데이터를 불러오고, 이미 데이터가 있으면 불러오지 않으며, 로딩 상태를 관리하는 useEffect 훅
  useEffect(() => {
    const fetchInquiries = async () => {
      if (inquiryList.length > 0) return; // 이미 데이터가 있으면 아무 작업도 하지 않음
      setLoading(true); // 데이터 로딩 시작

      try {
        const response = await axios.get("/api/myPage/list");
        if (response.status === 200) {
          const sortedInquiries = response.data.sort((a, b) => {
            const dateA = new Date(a.inserted);
            const dateB = new Date(b.inserted);
            return dateA - dateB;
          });
          setInquiryList(sortedInquiries);
        }
      } catch (error) {
        console.error("데이터를 불러오는 중 오류가 발생했습니다:", error);
      } finally {
        setLoading(false); // 데이터 로딩 완료
      }
    };

    fetchInquiries();
  }, []);

  const totalPages = Math.ceil(inquiryList.length / itemsPerPage);
  const paginatedInquiries = inquiryList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  function handlePageChange(newPage) {
    setCurrentPage(newPage);
  }

  const handleRowClick = (inquiryId) => {
    // 로컬 스토리지에 선택된 inquiryId 저장
    localStorage.setItem("selectedInquiryId", inquiryId);
    // InquiryView 페이지로 이동
    navigate(`/myPage/${inquiryId}`);
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <Box mt="60px">
      <Text fontSize="2xl" fontWeight="bold" mb={5} m={2}>
        문의 내역
      </Text>
      <Box>
        <Table.Root interactive>
          <TableHeader>
            <TableRow>
              <TableColumnHeader>번호</TableColumnHeader>
              <TableColumnHeader>문의 유형</TableColumnHeader>
              <TableColumnHeader>제목</TableColumnHeader>
              <TableColumnHeader>작성자</TableColumnHeader>
              <TableColumnHeader>작성 일자</TableColumnHeader>
              <TableColumnHeader>상태</TableColumnHeader>
            </TableRow>
          </TableHeader>
          <Table.Body>
            {paginatedInquiries.length > 0 ? (
              paginatedInquiries.map((inquiry) => (
                <Table.Row
                  onClick={() => handleRowClick(inquiry.inquiryId)}
                  key={inquiry.inquiryId}
                  style={{ cursor: "pointer" }}
                >
                  <Table.Cell>{inquiry.inquiryId}</Table.Cell>
                  <Table.Cell>{inquiry.category}</Table.Cell>
                  <Table.Cell>{inquiry.title}</Table.Cell>
                  <Table.Cell>{inquiry.memberId}</Table.Cell>
                  <Table.Cell>
                    {new Date(inquiry.inserted).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    {inquiry.hasAnswer ? (
                      <Badge variant={"subtle"} colorScheme="green">
                        <FaCommentDots /> 답변 완료
                      </Badge>
                    ) : (
                      <Badge variant={"subtle"} colorScheme="red">
                        <FaCommentDots /> 답변 대기
                      </Badge>
                    )}
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
};

export default InquiryList;
