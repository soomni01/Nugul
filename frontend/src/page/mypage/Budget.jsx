import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Text } from "@chakra-ui/react";

export function Budget({ memberId }) {
  const [monthlyPurchases, setMonthlyPurchases] = useState([]);
  const [monthlySales, setMonthlySales] = useState([]);
  const [loadingPurchases, setLoadingPurchases] = useState(true);
  const [loadingSales, setLoadingSales] = useState(true);
  const [errorPurchases, setErrorPurchases] = useState(null);
  const [errorSales, setErrorSales] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("2024-12");

  // 월별 구매 내역 불러오기
  useEffect(() => {
    const fetchMonthlyPurchases = async () => {
      try {
        const response = await axios.get("/api/myPage/monthly-purchases", {
          params: { id: memberId },
        });
        setMonthlyPurchases(response.data);
        setLoadingPurchases(false);
      } catch (err) {
        setErrorPurchases("Failed to load monthly purchases");
        setLoadingPurchases(false);
      }
    };

    fetchMonthlyPurchases();
  }, [memberId]);

  // 월별 판매 내역 불러오기
  useEffect(() => {
    const fetchMonthlySales = async () => {
      try {
        const response = await axios.get("/api/myPage/monthly-sales", {
          params: { id: memberId },
        });
        setMonthlySales(response.data);
        setLoadingSales(false);
      } catch (err) {
        setErrorSales("Failed to load monthly sales");
        setLoadingSales(false);
      }
    };

    fetchMonthlySales();
  }, [memberId]);

  // 선택한 월을 업데이트하는 함수
  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  // 선택된 월에 맞게 구매 내역 필터링
  const filteredPurchases = selectedMonth
    ? monthlyPurchases.filter((item) => item.month === selectedMonth)
    : monthlyPurchases;

  // 선택된 월에 맞게 판매 내역 필터링
  const filteredSales = selectedMonth
    ? monthlySales.filter((item) => item.month === selectedMonth)
    : monthlySales;

  // 월 리스트 생성 (중복 제거)
  const uniqueMonths = [
    ...new Set([
      ...monthlyPurchases.map((item) => item.month),
      ...monthlySales.map((item) => item.month),
    ]),
  ];

  // 선택된 월의 전체 구매 및 판매 금액 계산
  const totalPurchases = filteredPurchases.reduce(
    (sum, item) => sum + item.total_purchases,
    0,
  );
  const totalSales = filteredSales.reduce(
    (sum, item) => sum + item.total_sales,
    0,
  );

  // 월 전체 거래 금액 계산 (구매 금액 + 판매 금액)
  const totalTransaction = totalPurchases + totalSales;

  // 12월을 기본값으로 설정하고 나머지 월들을 표시
  const monthsToShow = uniqueMonths.filter((month) => month !== "2024-12");
  console.log("Monthly Purchases:", monthlyPurchases);
  console.log("Monthly Sales:", monthlySales);
  console.log("Unique Months:", uniqueMonths);

  return (
    <Box p={4} borderWidth="1px" borderRadius="lg" boxShadow="md" bg="white">
      <Box mb={4}>
        <select
          onChange={handleMonthChange}
          value={selectedMonth}
          style={{ width: "100%", padding: "8px", borderRadius: "4px" }}
        >
          {/* 기본값으로 12월을 설정 */}
          <option value="2024-12">2024년 12월</option>
          {uniqueMonths
            .filter((month) => month !== "2024-12")
            .sort((a, b) => (a < b ? 1 : -1)) // 내림차순 정렬
            .map((month) => (
              <option key={month} value={month}>
                {month.replace("-", "년 ")}월
              </option>
            ))}
        </select>
      </Box>
      <Box mb={4}>
        <Text fontSize="lg" fontWeight="bold" mb={2}>
          {selectedMonth.split("-")[1]}월 전체 거래 내역
        </Text>
        <Text>{totalTransaction} 원</Text>
      </Box>
      <hr style={{ marginBottom: "16px" }} />
      <Box>
        {filteredSales.length > 0 ? (
          <ul>
            {filteredSales.map((item, index) => (
              <li key={index}>판매 : {item.total_sales} 원</li>
            ))}
          </ul>
        ) : (
          <p>판매 내역이 없습니다.</p>
        )}
      </Box>
      <Box mt={4}>
        {" "}
        {filteredPurchases.length > 0 ? (
          <ul>
            {filteredPurchases.map((item, index) => (
              <li key={index}>구매 : {item.total_purchases} 원</li>
            ))}
          </ul>
        ) : (
          <p>구매 내역이 없습니다.</p>
        )}
      </Box>
    </Box>
  );
}
