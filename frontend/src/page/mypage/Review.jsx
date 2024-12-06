import React, { useContext, useEffect, useState } from "react";
import { Card, Heading, Spinner, Stack, Tabs } from "@chakra-ui/react";
import { LuFolder } from "react-icons/lu";
import { TfiWrite } from "react-icons/tfi";
import { AuthenticationContext } from "../../components/context/AuthenticationProvider.jsx";
import axios from "axios";

export function Review(props) {
  const [reviewList, setReviewList] = useState([]);
  const [value, setValue] = useState("buy");
  const [loading, setLoading] = useState(false);
  const { id } = useContext(AuthenticationContext);

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    axios
      .get("/api/myPage/review", {
        params: { id, role: value === "buy" ? "buyer" : "seller" },
      })
      .then((res) => {
        setReviewList(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log("후기를 가져오는 데 실패했습니다.", error);
        setLoading(false);
      });
  }, [id, value]);

  if (!id) {
    return <Spinner />;
  }

  return (
    <Tabs.Root
      value={value}
      // 객체로 전달되므로 문자열 추출해서 value 설정
      onValueChange={(newValue) => setValue(newValue?.value || newValue)}
    >
      <Tabs.List>
        <Tabs.Trigger value="buy">
          <TfiWrite />
          작성한 후기
        </Tabs.Trigger>
        <Tabs.Trigger value="sell">
          <LuFolder />
          받은 후기
        </Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content value="buy">
        <Stack>
          {loading ? (
            <Spinner />
          ) : (
            reviewList.map((review) => (
              <Card.Root size="sm" key={review.id}>
                <Card.Header>
                  <Heading size="md">{review.productName}</Heading>
                </Card.Header>
                <Card.Body color="fg.muted">{review.reviewText}</Card.Body>
              </Card.Root>
            ))
          )}
        </Stack>
      </Tabs.Content>

      <Tabs.Content value="sell">
        <Stack>
          {loading ? (
            <Spinner />
          ) : (
            reviewList.map((review) => (
              <Card.Root size="sm" key={review.id}>
                <Card.Header>
                  <Heading size="md">{review.productName}</Heading>
                </Card.Header>
                <Card.Body color="fg.muted">{review.reviewText}</Card.Body>
              </Card.Root>
            ))
          )}
        </Stack>
      </Tabs.Content>
    </Tabs.Root>
  );
}
