import { ProductListContainer } from "./ProductContainer.jsx";

export function ProductList() {
  return (
    <ProductListContainer
      apiEndpoint="/api/product/list"
      pay="sell"
      addProductRoute="/product/add"
    />
  );
}
