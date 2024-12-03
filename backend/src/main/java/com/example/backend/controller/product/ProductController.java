package com.example.backend.controller.product;

import com.example.backend.dto.product.Product;
import com.example.backend.service.product.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/product")
public class ProductController {

    final ProductService service;

    // 메인 페이지 상품
    @GetMapping("main")
    public Map<String, List<Product>> mainProduct() {
        return service.getProductMainList();
    }

    // 사용자가 좋아요한 상품
    @GetMapping("like/member")
    @PreAuthorize("isAuthenticated()")
    public List<Integer> getLikeMember(Authentication authentication) {
        return service.likedProductByMember(authentication);
    }

    // 각 상품별 좋아요 수 가져오기
    @GetMapping("likes")
    public List<Map<String, Object>> getLike() {
        return service.productLike();
    }

    // 좋아요 등록 & 취소
    @PostMapping("like")
    @PreAuthorize("isAuthenticated()")
    public Map<String, Object> like(@RequestBody Product product,
                                    Authentication authentication) {
        return service.like(product, authentication);
    }

    @PutMapping("update")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> update(
            Product product,
            Authentication authentication) {
        if (service.hasAccess(product.getProductId(), authentication)) {
            if (service.validate(product)) {
                if (service.update(product)) {
                    return ResponseEntity.ok()
                            .body(Map.of("message", Map.of("type", "success",
                                    "text", STR."\{product.getProductId()}번 상품 수정되었습니다.")));
                } else {
                    return ResponseEntity.internalServerError()
                            .body(Map.of("message", Map.of("type", "error",
                                    "text", STR."\{product.getProductId()}번 상품 수정되지 않았습니다.")));
                }
            } else {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", Map.of("type", "warning",
                                "text", "상품명, 가격, 거래 장소가 비어있습니다.")));
            }
        } else {
            return ResponseEntity.status(403)
                    .body(Map.of("message", Map.of("type", "error",
                            "text", "수정 권한이 없습니다.")));
        }
    }

    @DeleteMapping("delete/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> deleteProduct(
            @PathVariable int id,
            Authentication authentication) {
        if (service.hasAccess(id, authentication)) {
            if (service.deleteProduct(id)) {
                return ResponseEntity.ok()
                        .body(Map.of("message", Map.of("type", "success",
                                "text", STR."\{id}번 상품이 삭제되었습니다.")));
            } else {
                return ResponseEntity.internalServerError()
                        .body(Map.of("message", Map.of("type", "error",
                                "text", "상품 삭제 중 문제가 발생하였습니다.")));
            }
        } else {
            return ResponseEntity.status(403)
                    .body(Map.of("message", Map.of("type", "error",
                            "text", "삭제 권한이 없습니다.")));
        }
    }

    @GetMapping("/view/{id}")
    public Product view(@PathVariable int id) {
        return service.getProductView(id);
    }

    @GetMapping("list")
    public Map<String, Object> list(
            @RequestParam(value = "page", defaultValue = "1") Integer page,
            @RequestParam(value = "category", defaultValue = "all") String category,
            @RequestParam(value = "sk", defaultValue = "") String keyword,
            @RequestParam(value = "pay", defaultValue = "") String pay) {
        return service.getProductList(page, category, keyword, pay);
    }

    @PostMapping("add")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> add(
            Product product,
            @RequestParam(value = "files[]", required = false) MultipartFile[] files,
            @RequestParam(value = "mainImage", required = false) MultipartFile mainImage,
            Authentication authentication) {
        if (service.validate(product)) {
            if (service.add(product, files, mainImage, authentication)) {
                return ResponseEntity.ok()
                        .body(Map.of("message", Map.of("type", "success",
                                        "text", STR."\{product.getProductId()}번 상품이 등록되었습니다."),
                                "data", product));
            } else {
                return ResponseEntity.internalServerError()
                        .body(Map.of("message", Map.of("type", "error",
                                "text", "상품 등록이 실패하였습니다.")));
            }
        } else {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", Map.of("type", "error",
                            "text", "상품명, 가격, 거래 장소가 입력되지 않았습니다.")));
        }
    }
}
