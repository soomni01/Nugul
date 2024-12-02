import { ProductListContainer } from "./ProductContainer.jsx";

export function ProductShareList() {
  return (
    <ProductListContainer
      apiEndpoint="/api/product/list"
      pay="share"
      addProductRoute="/product/add"
    />
  );
}
