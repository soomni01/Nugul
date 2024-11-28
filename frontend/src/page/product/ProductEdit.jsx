import { Box } from "@chakra-ui/react";
import { useParams } from "react-router-dom";

export function ProductEdit() {
  const { id } = useParams();
  return (
    <Box>
      <h3>{id}번 상품 수정</h3>
    </Box>
  );
}
