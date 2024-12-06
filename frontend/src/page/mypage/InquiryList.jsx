import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import * as search from "eslint-plugin-react/lib/rules/jsx-props-no-spread-multi.js";

const InquiryList = () => {
  const [inquiryList, setInquiryList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const response = await axios.get("/api/inquiry/mylist");
        if (response.status === 200) {
          // 날짜를 오래된 순으로 정렬 (오름차순)
          const sortedInquiries = response.data.sort((a, b) => {
            const dateA = new Date(a.inserted);
            const dateB = new Date(b.inserted);
            return dateA - dateB;
          });
          setInquiryList(response.data);
        } else {
          console.error(
            "문의 내역을 불러오는 중 오류가 발생했습니다. 상태 코드:",
            response.status,
          );
        }
      } catch (error) {
        console.error(
          "문의 내역을 불러오는 중 네트워크 오류가 발생했습니다:",
          error,
        );
      }
    };
    fetchInquiries();
  }, []);

  // 문의 목록을 단순히 카테고리나 기타 조건으로 필터링함
  const filteredInquiries = inquiryList.filter((inquiry) => {
    const inquiryCategory = inquiry.category;

    if (!inquiry.title) {
      console.error("문의 데이터에 'title'이 누락되었습니다:", inquiry);
      return false;
    }

    // 예: 카테고리 조건만으로 필터링
    return search.category ? inquiryCategory === search.category : true;
  });

  // 필터링된 문의 목록을 현재 페이지와 페이지당 아이템 수에 따라 페이지네이션함
  const totalPages = Math.ceil(filteredInquiries.length / itemsPerPage);
  const paginatedInquiries = filteredInquiries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // 사용자가 페이지를 변경할 때 현재 페이지를 업데이트함
  function handlePageChange(newPage) {
    setCurrentPage(newPage);
  }

  // 행 클릭 시 문의 상세 페이지로 이동
  const handleRowClick = (inquiryId) => {
    navigate(`/inquiry/${inquiryId}`);
  };

  // '문의하기' 버튼 클릭 시 다른 페이지로 이동
  const handleNavigate = () => {
    navigate("/inquiry");
  };

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
      <Button onClick={handleNavigate}>문의하기</Button>
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
