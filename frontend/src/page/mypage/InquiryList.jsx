import React, { useEffect, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Flex,
  Table,
  TableColumnHeader,
  TableHeader,
  TableRow,
  Text,
} from "@chakra-ui/react";
import { FaCommentDots } from "react-icons/fa";
import axios from "axios";

const InquiryList = ({ onRowClick }) => {
  const [inquiryList, setInquiryList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchInquiries = async () => {
      const response = await axios.get("/api/myPage/list");
      if (response.status === 200) {
        const sortedInquiries = response.data.sort((a, b) => {
          const dateA = new Date(a.inserted);
          const dateB = new Date(b.inserted);
          return dateA - dateB;
        });
        setInquiryList(sortedInquiries);
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
                  onClick={() => onRowClick(inquiry.inquiryId)}
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
