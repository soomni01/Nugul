import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Table,
  TableColumnHeader,
  TableHeader,
  TableRow,
  Text,
} from "@chakra-ui/react";

export function PaymentRecord() {
  const [paymentRecords, setPaymentRecords] = useState([]);
  const [loading, setLoading] = useState(true);

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
          {paymentRecords.length > 0 ? (
            paymentRecords.map((record) => (
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
    </Box>
  );
}
