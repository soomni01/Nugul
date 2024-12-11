import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Box, Image, Text, VStack } from "@chakra-ui/react";
import { AuthenticationContext } from "../../components/context/AuthenticationProvider.jsx";

export function Budget({ memberId }) {
  const [monthlyPurchases, setMonthlyPurchases] = useState([]);
  const [monthlySales, setMonthlySales] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("2024-12");
  const { nickname } = useContext(AuthenticationContext);

  // 월별 구매 내역 불러오기
  useEffect(() => {
    const MonthlyPurchases = async () => {
      try {
        const response = await axios.get("/api/myPage/monthly-purchases", {
          params: { id: memberId },
        });
        setMonthlyPurchases(response.data);
      } catch (err) {
        console.error("월별 구매 내역을 불러오는 데 실패했습니다.");
      }
    };

    MonthlyPurchases();
  }, [memberId]);

  // 월별 판매 내역 불러오기
  useEffect(() => {
    const MonthlySales = async () => {
      try {
        const response = await axios.get("/api/myPage/monthly-sales", {
          params: { id: memberId },
        });
        setMonthlySales(response.data);
      } catch (err) {
        console.error("월별 판매 내역을 불러오는 데 실패했습니다.");
      }
    };

    MonthlySales();
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

  // 자동차 연비와 기름값을 설정
  const fuelEfficiency = 10; // 1리터당 주행 가능한 km
  const fuelPrice = 1500; // 리터당 가격 (예시: 리터당 1500원)

  // 거래 금액을 자동차 주행 거리로 변환하는 함수
  const calculateEquivalentDistance = (amount) => {
    const fuelConsumed = amount / fuelPrice; // 소비된 기름 리터
    const distance = fuelConsumed * fuelEfficiency; // 주행 거리 계산
    return distance;
  };

  // 보일러 사용 시간으로 변환하는 함수
  const boilerHourlyCost = 2000; // 보일러를 1시간 작동시켰을 때의 비용 (예시: 2000원)
  const calculateBoilerHours = (amount) => {
    const hours = amount / boilerHourlyCost; // 거래 금액을 보일러 1시간 작동 비용으로 나눔
    return hours;
  };

  const coffeePrice = 4500; // 커피 한 잔의 평균 가격 (원)
  const calculateCoffeeCups = (amount) => {
    return amount / coffeePrice; // 거래 금액에 따른 커피 잔 수 계산
  };

  // 전체 거래 금액을 기준으로 계산
  const equivalentDrivingDistance =
    calculateEquivalentDistance(totalTransaction);
  const equivalentCoffeeCups = calculateCoffeeCups(totalTransaction);
  const equivalentBoilerHours = calculateBoilerHours(totalTransaction);

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
          {nickname}님의 {selectedMonth.split("-")[1]}월 전체 거래 내역
        </Text>
        <Text>{totalTransaction} 원</Text>
      </Box>
      <hr style={{ marginBottom: "16px" }} />

      {/* 판매 내역 박스 */}
      <Box mb={4}>
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

      {/* 구매 내역 박스 */}
      <Box mt={4}>
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

      {/* 거래 가치 박스 */}
      <Box
        p={4}
        borderWidth="1px"
        borderRadius="lg"
        boxShadow="md"
        bg="gray.50"
        mt={4}
      >
        <Text fontSize="lg" fontWeight="bold" mb={2}>
          거래의 가치
        </Text>
        <VStack align="start" spacing={4}>
          <Text display="inline-flex" alignItems="center">
            <Image src="/image/Car.png" alt="Car Icon" boxSize="20px" mr={2} />
            자동차를 {equivalentDrivingDistance.toFixed(2)}km 덜 탄 것과 같아요.
          </Text>
          <Text display="inline-flex" alignItems="center">
            <Image
              src="/image/Boiler.png"
              alt="Boiler Icon"
              boxSize="20px"
              mr={2}
            />
            보일러를 약 {equivalentBoilerHours.toFixed(2)}시간 덜 킨 것과
            같아요.
          </Text>
          <Text display="inline-flex" alignItems="center">
            <Image
              src="/image/Coffee.png"
              alt="Coffee Icon"
              boxSize="20px"
              mr={2}
            />
            커피를 약 {equivalentCoffeeCups.toFixed(2)}잔 마실 수 있는 것과
            같아요.
          </Text>
        </VStack>
      </Box>
    </Box>
  );
}
