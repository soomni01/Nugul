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

    // 거래 완료
    @PostMapping("transaction/{productId}")
    public ResponseEntity<Map<String, Object>> transaction(
            @PathVariable int productId, @RequestBody Map<String, Integer> requestBody, Authentication auth) {
        Integer roomId = requestBody.get("roomId"); // 요청 body에서 roomId 추출
        if (service.hasPayAccess(roomId, auth)) {
            if (service.transaction(productId, auth)) {
                return ResponseEntity.ok()
                        .body(Map.of("message", Map.of("type", "success", "text", STR."\{productId}번 상품 거래가 완료되었습니다.")));
            } else {
                return ResponseEntity.internalServerError()
                        .body(Map.of("message", Map.of("type", "error", "text", "상품 거래 중 문제가 발생하였습니다.")));
            }
        } else {
            return ResponseEntity.status(403)
                    .body(Map.of("message", Map.of("type", "error", "text", "거래를 완료할 권한이 없습니다.")));
        }
    }


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

    // 상품 정보 수정하기
    @PutMapping("update")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> update(
            Product product,
            @RequestParam(value = "removeFiles[]", required = false) List<String> removeFiles,
            @RequestParam(value = "uploadFiles[]", required = false) MultipartFile[] uploadFiles,
            @RequestParam(value = "mainImageName", required = false) String mainImageName,
            Authentication authentication) {
        if (service.hasAccess(product.getProductId(), authentication)) {
            if (service.validate(product)) {
                if (service.update(product, removeFiles, uploadFiles, mainImageName)) {
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

    // 관리자 페이지에서 구매, 판매 내역 들어가서 상품 삭제
    @DeleteMapping("admin/delete/{productId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> adminDeleteProduct(@PathVariable int productId, Authentication authentication) {
        if (service.hasAccess(productId, authentication)) {
            if (service.deleteProduct(productId)) {
                // 관리자 권한일 때 메시지 설정
                if (authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
                } else {
                    return ResponseEntity.ok()
                            .body(Map.of("message", Map.of("type", "success",
                                    "text", STR."\{productId}번 상품이 삭제되었습니다.")));
                }
                return ResponseEntity.ok()
                        .body(Map.of("message", Map.of("type", "success",
                                "text", "관리자 권한으로 상품이 삭제되었습니다.")));
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

    // 상품 삭제하기
    @DeleteMapping("delete/{productId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> deleteProduct(
            @PathVariable int productId,
            Authentication authentication) {
        if (service.hasAccess(productId, authentication)) {
            if (service.deleteProduct(productId)) {
                return ResponseEntity.ok()
                        .body(Map.of("message", Map.of("type", "success",
                                "text", STR."\{productId}번 상품이 삭제되었습니다.")));

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

    // 상품 1개의 정보 가져오기
    @GetMapping("/view/{productId}")
    public Product view(@PathVariable Integer productId) {
        return service.getProductView(productId);
    }

    // 페이지, 카테고리, 검색, 지불방법 별 상품 목록 가져오기
    @GetMapping("list")
    public Map<String, Object> list(
            @RequestParam(value = "page", defaultValue = "1") Integer page,
            @RequestParam(value = "category", defaultValue = "all") String category,
            @RequestParam(value = "sk", defaultValue = "") String keyword,
            @RequestParam(value = "pay", defaultValue = "") String pay) {
        return service.getProductList(page, category, keyword, pay);
    }

    // 상품 추가하기
    @PostMapping("add")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> add(
            Product product,
            @RequestParam(value = "files[]", required = false) MultipartFile[] files,
            @RequestParam(value = "mainImageName", required = false) String mainImageName,
            Authentication authentication) {
        if (service.validate(product)) {
            if (service.add(product, files, mainImageName, authentication)) {
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
