package com.example.backend.controller.mypage;

import com.example.backend.dto.inquiry.Inquiry;
import com.example.backend.dto.product.Product;
import com.example.backend.service.mypage.MyPageService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/myPage")
public class MyPageController {

    final MyPageService service;

    // 내 구매 상품 목록 가져오기
    @GetMapping("purchased")
    @PreAuthorize("isAuthenticated()")
    public List<Product> getPurchasedProducts(@RequestParam String id) {
        return service.getPurchasedProducts(id);
    }

    // 내 판매 상품 목록 가져오기
    @GetMapping("sold")
    @PreAuthorize("isAuthenticated()")
    public List<Product> getSoldProducts(@RequestParam String id) {
        return service.getSoldProducts(id);
    }

    // 내 관심 상품 목록 가져오기
    @GetMapping("like")
    @PreAuthorize("isAuthenticated()")
    public List<Product> getLikes(Authentication authentication) {
        return service.getLikes(authentication);
    }

    // 내 문의 내역 목록 가져오기
    @GetMapping("/list")
    @PreAuthorize("isAuthenticated()")
    public List<Inquiry> List(Authentication auth) {
        String memberId = auth.getName(); // 로그인한 사용자의 ID 가져오기
        return service.getInquiryByMemberId(memberId);
    }
    
//    // 내 문의 내역에서 상세 문의 보기
//    @GetMapping("/detail")
//    @PreAuthorize("isAuthenticated()")
//    public Inquiry viewInquiry(@RequestParam String id, Authentication auth) {
//        String memberId = auth.getName();
//        return service.getInquiryDetailByMemberId(memberId, inquiryId);
//    }
}
