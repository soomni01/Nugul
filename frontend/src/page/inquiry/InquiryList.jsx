import React, { useContext, useEffect, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Flex,
  Grid,
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

  // 문의 내역 데이터 로드
  useEffect(() => {
    const fetchInquiries = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/inquiry/myList");
        if (response.status === 200) {
          setInquiryList(response.data); // 정렬 없이 그대로 설정
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
    navigate(`/inquiry/myList/${inquiryId}`);
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
      <Grid
        templateColumns="1fr auto"
        gap={4}
        mr={1}
        mb={4}
        alignItems="center"
      >
        <Text fontSize="2xl" fontWeight="bold">
          1:1 문의 내역
        </Text>
        <Button
          width="100%"
          height="120%"
          colorScheme="blue"
          onClick={() => navigate("/inquiry")}
        >
          문의하기
        </Button>
      </Grid>
      <Box pt={4} display="flex" justifyContent="center">
        <Table.Root interactive>
          <TableHeader>
            <TableRow style={{ backgroundColor: "#EAEAEA" }}>
              <TableColumnHeader
                style={{
                  ...cellStyle,
                  width: "11%",
                }}
              >
                번호
              </TableColumnHeader>
              <TableColumnHeader
                style={{
                  ...cellStyle,
                  width: "15%",
                }}
              >
                문의 유형
              </TableColumnHeader>
              <TableColumnHeader
                style={{
                  ...cellStyle,
                  width: "20%",
                }}
              >
                문의 제목
              </TableColumnHeader>
              <TableColumnHeader
                style={{
                  ...cellStyle,
                  width: "15%",
                }}
              >
                작성자
              </TableColumnHeader>
              <TableColumnHeader
                style={{
                  ...cellStyle,
                  width: "15%",
                }}
              >
                작성 일자
              </TableColumnHeader>
              <TableColumnHeader
                style={{
                  ...cellStyle,
                  width: "16%",
                }}
              >
                상태
              </TableColumnHeader>
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
