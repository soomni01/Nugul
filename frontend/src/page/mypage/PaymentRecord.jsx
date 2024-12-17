import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Flex,
  Table,
  TableColumnHeader,
  TableHeader,
  TableRow,
  Text,
} from "@chakra-ui/react";

export function PaymentRecord() {
  const [paymentRecords, setPaymentRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 데이터 가져오기
  useEffect(() => {
    axios
      .get("/api/getPayment")
      .then((response) => {
        // 결제 내역을 오름차순 정렬
        const sortedRecords = response.data.sort(
          (a, b) => new Date(a.paymentDate) - new Date(b.paymentDate),
        );
        setPaymentRecords(sortedRecords);
        setLoading(false);
      })
      .catch((error) => {
        console.error("결제 내역을 가져오는 중 오류 발생:", error);
        setLoading(false);
      });
  }, []);

  // 페이지네이션 관련 데이터
  const totalPages = Math.ceil(paymentRecords.length / itemsPerPage); // 전체 페이지 수
  const paginatedRecords = paymentRecords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // 페이지 변경 핸들러
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <Box mt="60px">
      <Text fontSize="2xl" fontWeight="bold" mb={5} m={2}>
        결제 내역
      </Text>
      <Table.Root interactive>
        <TableHeader>
          <TableRow>
            <TableColumnHeader>결제 ID</TableColumnHeader>
            <TableColumnHeader>구매자 ID</TableColumnHeader>
            <TableColumnHeader>상품명</TableColumnHeader>
            <TableColumnHeader>결제 금액</TableColumnHeader>
            <TableColumnHeader>결제 방법</TableColumnHeader>
            <TableColumnHeader>결제 날짜</TableColumnHeader>
            <TableColumnHeader>결제 상태</TableColumnHeader>
          </TableRow>
        </TableHeader>
        <Table.Body>
          {paginatedRecords.length > 0 ? (
            paginatedRecords.map((record) => (
              <Table.Row key={record.impUid}>
                <Table.Cell>{record.impUid}</Table.Cell>
                <Table.Cell>{record.buyerId}</Table.Cell>
                <Table.Cell>{record.productName}</Table.Cell>
                <Table.Cell>{record.paymentAmount}원</Table.Cell>
                <Table.Cell>
                  {record.paymentMethod === "point"
                    ? "카카오페이"
                    : record.paymentMethod}
                </Table.Cell>
                <Table.Cell>{record.paymentDate}</Table.Cell>
                <Table.Cell>
                  {record.status === "paid" ? "결제 완료" : record.status}
                </Table.Cell>
              </Table.Row>
            ))
          ) : (
            <Table.Row>
              <Table.Cell colSpan={7} style={{ textAlign: "center" }}>
                결제 내역이 없습니다.
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table.Root>

      {/* 페이지네이션 */}
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
