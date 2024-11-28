package com.example.backend.contoller.product;

import com.example.backend.dto.product.Product;
import com.example.backend.service.product.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/product")
public class ProductController {

    final ProductService service;

    @DeleteMapping("delete/{id}")
    public ResponseEntity<Map<String, Object>> deleteProduct(@PathVariable int id) {
        if (service.deleteProduct(id)) {
            return ResponseEntity.ok()
                    .body(Map.of("message", Map.of("type", "success",
                            "text", STR."\{id}번 상품이 삭제되었습니다.")));
        } else {
            return ResponseEntity.internalServerError()
                    .body(Map.of("message", Map.of("type", "error",
                            "text", "상품 삭제 중 문제가 발생하였습니다.")));
        }
    }

    @GetMapping("/view/{id}")
    public Product view(@PathVariable int id) {
        return service.getProductView(id);
    }

    @GetMapping("list")
    public List<Product> list() {
        return service.getProductList();
    }

    @PostMapping("add")
    public ResponseEntity<Map<String, Object>> add(
            Product product,
            @RequestParam(value = "files[]", required = false) MultipartFile[] files,
            @RequestParam(value = "mainImage", required = false) MultipartFile mainImage) {
        if (service.validate(product)) {
            if (service.add(product, files, mainImage)) {
                return ResponseEntity.ok()
                        .body(Map.of("message", Map.of("type", "success",
                                        "text", STR."\{product.getProductId()}번 상품이 등록되었습니다."),
                                "data", product));
            } else {
                return ResponseEntity.internalServerError()
                        .body(Map.of("message", Map.of("type", "error",
                                "text", "게시물 상품이 실패하였습니다.")));
            }
        } else {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", Map.of("type", "error",
                            "text", "상품명, 가격, 거래 장소가 입력되지 않았습니다.")));
        }
    }
}
