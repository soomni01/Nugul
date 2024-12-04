package com.example.backend.controller.admin;

import com.example.backend.dto.product.Product;
import com.example.backend.service.admin.AdminMemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/members")
public class AdminMemberController {

    final AdminMemberService service;

    @GetMapping("/{memberId}/sold")
    @PreAuthorize("isAuthenticated()")
    public List<Product> getSoldProducts(@PathVariable String memberId) {
        // PathVariable로 받은 memberId를 사용하여 판매 상품 반환
        return service.getSoldProductsByMember(memberId);
    }

    @GetMapping("/{memberId}/purchased")
    @PreAuthorize("isAuthenticated()")
    public List<Product> getPurchasedProducts(@PathVariable String memberId) {
        // PathVariable로 받은 memberId를 사용하여 구매 상품 반환
        return service.getPurchasedProductsByMember(memberId);
    }
}
