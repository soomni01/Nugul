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
  const [currentPage, setCurrentPage] = useState(1);
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

    // 회원의 판매 및 구매 내역 데이터를 가져와 상태 업데이트
    Promise.all([fetchSoldProducts, fetchPurchasedProducts])
      .then(([soldRes, purchasedRes]) => {
        console.log("판매 내역 데이터:", soldRes.data);
        console.log("구매 내역 데이터:", purchasedRes.data);
        setSoldList(soldRes.data);
        setPurchasedList(purchasedRes.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("데이터를 가져오는 중 오류 발생:", error);
        setSoldList([]);
        setPurchasedList([]);
        setLoading(false);
      });
  }, [memberId]);

  // 로딩 중일 때 표시
  if (loading) {
    return <Spinner />;
  }

  // 페이지네이션 로직
  const indexOfLastSold = currentPage * itemsPerPage;
  const indexOfFirstSold = indexOfLastSold - itemsPerPage;
  const currentSoldList = soldList.slice(indexOfFirstSold, indexOfLastSold);

  const indexOfLastPurchased = currentPage * itemsPerPage;
  const indexOfFirstPurchased = indexOfLastPurchased - itemsPerPage;
  const currentPurchasedList = purchasedList.slice(
    indexOfFirstPurchased,
    indexOfLastPurchased,
  );

  const totalSoldPages = Math.ceil(soldList.length / itemsPerPage);
  const totalPurchasedPages = Math.ceil(purchasedList.length / itemsPerPage);

  // 페이지 변경 시 현재 페이지를 업데이트
  function handlePageChange(newPage) {
    setCurrentPage(newPage);
  }

  return (
    <Box p={4} pt={20}>
      <Stack spacing={8}>
        <Tabs.Root defaultValue="SoldProducts">
          <Tabs.List
            style={{ display: "flex", alignItems: "center", gap: "8px" }}
          >
            <Tabs.Trigger value="SoldProducts">판매 내역</Tabs.Trigger>
            <Tabs.Trigger value="PurchasedProducts">구매 내역</Tabs.Trigger>
          </Tabs.List>

          {/* 판매 내역 탭 */}
          <Tabs.Content value="SoldProducts">
            <Box mt={-3}>
              <Table.Root interactive>
                <TableHeader>
                  <TableRow>
                    <TableColumnHeader>ID</TableColumnHeader>
                    <TableColumnHeader>상품명</TableColumnHeader>
                    <TableColumnHeader>가격</TableColumnHeader>
                    <TableColumnHeader>작성자</TableColumnHeader>
                    <TableColumnHeader>카테고리</TableColumnHeader>
                    <TableColumnHeader>상태</TableColumnHeader>
                    <TableColumnHeader>작성 일자</TableColumnHeader>
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
                        <Table.Cell>{product.productId}</Table.Cell>
                        <Table.Cell>{product.productName}</Table.Cell>
                        <Table.Cell>
                          {product.price ? `${product.price}원` : "무료 나눔"}
                        </Table.Cell>
                        <Table.Cell>{product.writer}</Table.Cell>
                        <Table.Cell>
                          {getCategoryLabel(product.category)}
                        </Table.Cell>
                        <Table.Cell>{product.status}</Table.Cell>
                        <Table.Cell>
                          {new Date(product.createdAt).toLocaleDateString()}
                        </Table.Cell>
                      </Table.Row>
                    ))
                  ) : (
                    <Table.Row>
                      <Table.Cell colSpan={7} style={{ textAlign: "center" }}>
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
                  onClick={() => handlePageChange(page + 1)}
                  style={{
                    padding: "5px 10px",
                    backgroundColor:
                      currentPage === page + 1 ? "#D2D2D2" : "#E4E4E4",
                    color: currentPage === page + 1 ? "white" : "black",
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
            <Box>
              <Table.Root interactive>
                <TableHeader>
                  <TableRow>
                    <TableColumnHeader>ID</TableColumnHeader>
                    <TableColumnHeader>상품명</TableColumnHeader>
                    <TableColumnHeader>가격</TableColumnHeader>
                    <TableColumnHeader>작성자</TableColumnHeader>
                    <TableColumnHeader>카테고리</TableColumnHeader>
                    <TableColumnHeader>상태</TableColumnHeader>
                    <TableColumnHeader>작성 일자</TableColumnHeader>
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
                        <Table.Cell>{product.productId}</Table.Cell>
                        <Table.Cell>{product.productName}</Table.Cell>
                        <Table.Cell>
                          {product.price ? `${product.price}원` : "무료 나눔"}
                        </Table.Cell>
                        <Table.Cell>{product.writer}</Table.Cell>
                        <Table.Cell>
                          {getCategoryLabel(product.category)}
                        </Table.Cell>
                        <Table.Cell>{product.status}</Table.Cell>
                        <Table.Cell>
                          {new Date(product.createdAt).toLocaleDateString()}
                        </Table.Cell>
                      </Table.Row>
                    ))
                  ) : (
                    <Table.Row>
                      <Table.Cell colSpan={7} style={{ textAlign: "center" }}>
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
                  onClick={() => handlePageChange(page + 1)}
                  style={{
                    padding: "5px 10px",
                    backgroundColor:
                      currentPage === page + 1 ? "#D2D2D2" : "#E4E4E4",
                    color: currentPage === page + 1 ? "white" : "black",
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
