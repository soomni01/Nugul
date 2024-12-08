import React from "react";
import { Button } from "@chakra-ui/react";

export function PayButton({ paymentLink }) {
  return (
    <Button
      colorScheme="blue"
      onClick={() =>
        (window.location.href = "https://link.kakaopay.com/_/FdI3mJB")
      }
    >
      송금하기
    </Button>
  );
}
