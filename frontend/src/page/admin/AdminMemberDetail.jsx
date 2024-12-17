import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Flex,
  Spinner,
  Stack,
  Table,
  TableColumnHeader,
  TableHeader,
  TableRow,
  Tabs,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../components/ui/button.jsx";
import { categories } from "../../components/category/CategoryContainer.jsx";

export function AdminMemberDetail() {
  const { memberId } = useParams();
  const navigate = useNavigate();
  const [soldList, setSoldList] = useState([]);
  const [purchasedList, setPurchasedList] = useState([]);
  const [paymentRecords, setPaymentRecords] = useState([]);
  const [currentPageSold, setCurrentPageSold] = useState(1);
  const [currentPagePurchased, setCurrentPagePurchased] = useState(1);
  const [currentPagePayment, setCurrentPagePayment] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 10;

  // 카테고리 값을 한글로 변환하는 함수
  function getCategoryLabel(value) {
    const category = categories.find((cat) => cat.value === value);
    return category ? category.label : "전체"; // "전체"를 기본값으로 반환
  }

  // 데이터 로드 및 상태 설정
  useEffect(() => {
    const fetchSoldProducts = axios.get("/api/myPage/sold", {
      params: { id: memberId },
    });
    const fetchPurchasedProducts = axios.get("/api/myPage/purchased", {
      params: { id: memberId },
    });
    const fetchPaymentRecords = axios.get("/api/getPaymentByMember", {
      params: { memberId },
    });

    // 회원의 판매, 구매, 결제 내역 데이터를 가져와 상태 업데이트
    Promise.all([
      fetchSoldProducts,
      fetchPurchasedProducts,
      fetchPaymentRecords,
    ])
      .then(([soldRes, purchasedRes, paymentRes]) => {
        console.log("판매 내역 데이터:", soldRes.data);
        console.log("구매 내역 데이터:", purchasedRes.data);
        console.log("결제 내역 데이터:", paymentRes.data);

        setSoldList(soldRes.data);

        // 구매 내역을 오름차순 정렬
        const sortedPurchasedList = purchasedRes.data.sort((a, b) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return dateA - dateB;
        });
        setPurchasedList(sortedPurchasedList);

        // 결제 내역을 오름차순 정렬
        const sortedPaymentRecords = paymentRes.data.sort((a, b) => {
          const dateA = new Date(a.paymentDate);
          const dateB = new Date(b.paymentDate);
          return dateA - dateB;
        });
        setPaymentRecords(sortedPaymentRecords);

        setLoading(false);
      })
      .catch((error) => {
        console.error("데이터를 가져오는 중 오류 발생:", error);
        setSoldList([]);
        setPurchasedList([]);
        setPaymentRecords([]);
        setLoading(false);
      });
  }, [memberId]);

  // 로딩 중일 때 표시
  if (loading) {
    return <Spinner />;
  }

  // 판매 내역 페이지네이션 로직
  const indexOfLastSold = currentPageSold * itemsPerPage;
  const indexOfFirstSold = indexOfLastSold - itemsPerPage;
  const currentSoldList = soldList.slice(indexOfFirstSold, indexOfLastSold);
  const totalSoldPages = Math.ceil(soldList.length / itemsPerPage);

  // 구매 내역 페이지네이션 로직
  const indexOfLastPurchased = currentPagePurchased * itemsPerPage;
  const indexOfFirstPurchased = indexOfLastPurchased - itemsPerPage;
  const currentPurchasedList = purchasedList.slice(
    indexOfFirstPurchased,
    indexOfLastPurchased,
  );
  const totalPurchasedPages = Math.ceil(purchasedList.length / itemsPerPage);

  // 결제 내역 페이지네이션 로직
  const indexOfLastPayment = currentPagePayment * itemsPerPage;
  const indexOfFirstPayment = indexOfLastPayment - itemsPerPage;
  const currentPaymentRecords = paymentRecords.slice(
    indexOfFirstPayment,
    indexOfLastPayment,
  );
  const totalPaymentPages = Math.ceil(paymentRecords.length / itemsPerPage);

  // 페이지 변경 시 현재 페이지를 업데이트
  function handlePageChange(tab, newPage) {
    if (tab === "sold") {
      setCurrentPageSold(newPage);
    } else if (tab === "purchased") {
      setCurrentPagePurchased(newPage);
    } else if (tab === "payment") {
      setCurrentPagePayment(newPage);
    }
  }

  const headerStyle = {
    padding: "10px",
    height: "50px",
    textAlign: "center",
    backgroundColor: "#f4f4f4",
    fontWeight: "bold",
  };

  const cellStyle = {
    padding: "10px",
    height: "50px",
    textAlign: "center",
  };

  return (
    <Box p={4} pt={20}>
      <Stack spacing={8}>
        <Tabs.Root defaultValue="SoldProducts">
          <Tabs.List
            style={{ display: "flex", alignItems: "center", gap: "8px" }}
          >
            <span>{memberId} 님의</span>
            <Tabs.Trigger value="SoldProducts">판매 내역</Tabs.Trigger>
            <Tabs.Trigger value="PurchasedProducts">구매 내역</Tabs.Trigger>
            <Tabs.Trigger value="PaymentRecord">결제 내역</Tabs.Trigger>
          </Tabs.List>

          {/* 판매 내역 탭 */}
          <Tabs.Content value="SoldProducts">
            <Box mt={-4}>
              <Table.Root interactive>
                <TableHeader>
                  <TableRow>
                    <TableColumnHeader
                      style={{ ...headerStyle, width: "200px" }}
                    >
                      ID
                    </TableColumnHeader>
                    <TableColumnHeader
                      style={{ ...headerStyle, width: "200px" }}
                    >
                      카테고리
                    </TableColumnHeader>
                    <TableColumnHeader
                      style={{ ...headerStyle, width: "300px" }}
                    >
                      상품명
                    </TableColumnHeader>
                    <TableColumnHeader
                      style={{ ...headerStyle, width: "200px" }}
                    >
                      가격
                    </TableColumnHeader>
                    <TableColumnHeader
                      style={{ ...headerStyle, width: "250px" }}
                    >
                      작성자
                    </TableColumnHeader>
                    <TableColumnHeader
                      style={{ ...headerStyle, width: "200px" }}
                    >
                      상태
                    </TableColumnHeader>
                    <TableColumnHeader
                      style={{ ...headerStyle, width: "250px" }}
                    >
                      작성 일자
                    </TableColumnHeader>
                  </TableRow>
                </TableHeader>
                <Table.Body>
                  {currentSoldList.length > 0 ? (
                    currentSoldList.map((product) => (
                      <Table.Row
                        key={product.productId}
                        onClick={() => {
                          console.log("Product clicked", product.productId);
                          navigate(`/product/view/${product.productId}`);
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        <Table.Cell style={cellStyle}>
                          {product.productId}
                        </Table.Cell>
                        <Table.Cell style={cellStyle}>
                          {getCategoryLabel(product.category)}
                        </Table.Cell>
                        <Table.Cell style={cellStyle}>
                          {product.productName}
                        </Table.Cell>
                        <Table.Cell style={cellStyle}>
                          {product.price ? `${product.price}원` : "무료 나눔"}
                        </Table.Cell>
                        <Table.Cell style={cellStyle}>
                          {product.writer}
                        </Table.Cell>
                        <Table.Cell style={cellStyle}>
                          {product.status}
                        </Table.Cell>
                        <Table.Cell style={cellStyle}>
                          {new Date(product.createdAt).toLocaleDateString()}
                        </Table.Cell>
                      </Table.Row>
                    ))
                  ) : (
                    <Table.Row>
                      <Table.Cell
                        colSpan={7}
                        style={{ textAlign: "center", padding: "22px" }}
                      >
                        판매 내역이 없습니다.
                      </Table.Cell>
                    </Table.Row>
                  )}
                </Table.Body>
              </Table.Root>
            </Box>
            <Flex justify="center" mt={4} gap={2}>
              {[...Array(totalSoldPages).keys()].map((page) => (
                <Button
                  key={page + 1}
                  onClick={() => handlePageChange("sold", page + 1)}
                  style={{
                    padding: "5px 10px",
                    backgroundColor:
                      currentPageSold === page + 1 ? "#D2D2D2" : "#E4E4E4",
                    color: currentPageSold === page + 1 ? "white" : "black",
                    border: "none",
                    borderRadius: "3px",
                    cursor: "pointer",
                  }}
                >
                  {page + 1}
                </Button>
              ))}
            </Flex>
          </Tabs.Content>

          {/* 구매 내역 탭 */}
          <Tabs.Content value="PurchasedProducts">
            <Box mt={-4}>
              <Table.Root interactive>
                <TableHeader>
                  <TableRow>
                    <TableColumnHeader
                      style={{ ...headerStyle, width: "200px" }}
                    >
                      ID
                    </TableColumnHeader>
                    <TableColumnHeader
                      style={{ ...headerStyle, width: "150px" }}
                    >
                      카테고리
                    </TableColumnHeader>
                    <TableColumnHeader
                      style={{ ...headerStyle, width: "300px" }}
                    >
                      상품명
                    </TableColumnHeader>
                    <TableColumnHeader
                      style={{ ...headerStyle, width: "200px" }}
                    >
                      가격
                    </TableColumnHeader>
                    <TableColumnHeader
                      style={{ ...headerStyle, width: "250px" }}
                    >
                      작성자
                    </TableColumnHeader>
                    <TableColumnHeader
                      style={{ ...headerStyle, width: "250px" }}
                    >
                      작성 일자
                    </TableColumnHeader>
                  </TableRow>
                </TableHeader>
                <Table.Body>
                  {currentPurchasedList.length > 0 ? (
                    currentPurchasedList.map((product) => (
                      <Table.Row
                        key={product.productId}
                        onClick={() => {
                          console.log("Product clicked", product.productId);
                          navigate(`/product/view/${product.productId}`);
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        <Table.Cell style={cellStyle}>
                          {product.productId
                            ? `${product.productId}`
                            : "상품 정보 없음"}
                        </Table.Cell>
                        <Table.Cell style={cellStyle}>
                          {getCategoryLabel(product.category)}
                        </Table.Cell>
                        <Table.Cell style={cellStyle}>
                          {product.productName}
                        </Table.Cell>
                        <Table.Cell style={cellStyle}>
                          {product.price ? `${product.price}원` : "무료 나눔"}
                        </Table.Cell>
                        <Table.Cell style={cellStyle}>
                          {product.writer}
                        </Table.Cell>
                        <Table.Cell style={cellStyle}>
                          {product.createdAt &&
                          !isNaN(new Date(product.createdAt))
                            ? new Date(product.createdAt).toLocaleDateString()
                            : ""}{" "}
                          {/* 날짜가 없으면 빈 문자열 반환 */}
                        </Table.Cell>
                      </Table.Row>
                    ))
                  ) : (
                    <Table.Row>
                      <Table.Cell
                        colSpan={7}
                        style={{ textAlign: "center", padding: "22px" }}
                      >
                        구매 내역이 없습니다.
                      </Table.Cell>
                    </Table.Row>
                  )}
                </Table.Body>
              </Table.Root>
            </Box>
            <Flex justify="center" mt={4} gap={2}>
              {[...Array(totalPurchasedPages).keys()].map((page) => (
                <Button
                  key={page + 1}
                  onClick={() => handlePageChange("purchased", page + 1)}
                  style={{
                    padding: "5px 10px",
                    backgroundColor:
                      currentPagePurchased === page + 1 ? "#D2D2D2" : "#E4E4E4",
                    color:
                      currentPagePurchased === page + 1 ? "white" : "black",
                    border: "none",
                    borderRadius: "3px",
                    cursor: "pointer",
                  }}
                >
                  {page + 1}
                </Button>
              ))}
            </Flex>
          </Tabs.Content>

          {/* 결제 내역 탭 */}
          <Tabs.Content value="PaymentRecord">
            <Box mt={-4}>
              <Table.Root interactive>
                <TableHeader>
                  <TableRow>
                    <TableColumnHeader
                      style={{ ...headerStyle, width: "200px" }}
                    >
                      결제 ID
                    </TableColumnHeader>
                    <TableColumnHeader
                      style={{ ...headerStyle, width: "200px" }}
                    >
                      구매자 ID
                    </TableColumnHeader>
                    <TableColumnHeader
                      style={{ ...headerStyle, width: "300px" }}
                    >
                      상품명
                    </TableColumnHeader>
                    <TableColumnHeader
                      style={{ ...headerStyle, width: "200px" }}
                    >
                      결제 금액
                    </TableColumnHeader>
                    <TableColumnHeader
                      style={{ ...headerStyle, width: "200px" }}
                    >
                      결제 방법
                    </TableColumnHeader>
                    <TableColumnHeader
                      style={{ ...headerStyle, width: "200px" }}
                    >
                      결제 날짜
                    </TableColumnHeader>
                    <TableColumnHeader
                      style={{ ...headerStyle, width: "200px" }}
                    >
                      결제 상태
                    </TableColumnHeader>
                  </TableRow>
                </TableHeader>
                <Table.Body>
                  {currentPaymentRecords.length > 0 ? (
                    currentPaymentRecords.map((record) => (
                      <Table.Row key={record.impUid}>
                        <Table.Cell style={cellStyle}>
                          {record.impUid}
                        </Table.Cell>
                        <Table.Cell style={cellStyle}>
                          {record.buyerId}
                        </Table.Cell>
                        <Table.Cell style={cellStyle}>
                          {record.productName}
                        </Table.Cell>
                        <Table.Cell style={cellStyle}>
                          {record.paymentAmount}원
                        </Table.Cell>
                        <Table.Cell style={cellStyle}>
                          {record.paymentMethod === "point"
                            ? "카카오페이"
                            : record.paymentMethod}
                        </Table.Cell>
                        <Table.Cell style={cellStyle}>
                          {record.paymentDate}
                        </Table.Cell>
                        <Table.Cell style={cellStyle}>
                          {record.status === "paid"
                            ? "결제 완료"
                            : record.status}
                        </Table.Cell>
                      </Table.Row>
                    ))
                  ) : (
                    <Table.Row>
                      <Table.Cell
                        colSpan={7}
                        style={{ textAlign: "center", padding: "22px" }}
                      >
                        결제 내역이 없습니다.
                      </Table.Cell>
                    </Table.Row>
                  )}
                </Table.Body>
              </Table.Root>
            </Box>
            <Flex justify="center" mt={4} gap={2}>
              {[...Array(totalPaymentPages).keys()].map((page) => (
                <Button
                  key={page + 1}
                  onClick={() => handlePageChange("payment", page + 1)}
                  style={{
                    padding: "5px 10px",
                    backgroundColor:
                      currentPagePayment === page + 1 ? "#D2D2D2" : "#E4E4E4",
                    color: currentPagePayment === page + 1 ? "white" : "black",
                    border: "none",
                    borderRadius: "3px",
                    cursor: "pointer",
                  }}
                >
                  {page + 1}
                </Button>
              ))}
            </Flex>
          </Tabs.Content>
        </Tabs.Root>
      </Stack>
    </Box>
  );
}
