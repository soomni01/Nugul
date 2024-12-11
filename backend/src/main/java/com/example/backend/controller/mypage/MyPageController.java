package com.example.backend.controller.mypage;

import com.example.backend.dto.inquiry.Inquiry;
import com.example.backend.dto.member.Member;
import com.example.backend.dto.product.Product;
import com.example.backend.dto.review.Review;
import com.example.backend.service.mypage.MyPageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/myPage")
public class MyPageController {

    final MyPageService service;

    // 사용자 프로필 저장하기
    @PostMapping("image")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> image(
            @RequestParam("memberId") String memberId,
            @RequestParam(value = "profileImage", required = false) MultipartFile profileImage,
            Authentication authentication) {
        System.out.println(profileImage);
        if (service.image(memberId, profileImage, authentication)) {
            return ResponseEntity.ok()
                    .body(Map.of("message", Map.of("type", "success",
                            "text", "프로필 이미지가 등록되었습니다.")));
        } else {
            return ResponseEntity.internalServerError()
                    .body(Map.of("message", Map.of("type", "error",
                            "text", "프로필 이미지 등록이 실패하였습니다.")));
        }
    }

    // 평점과 프로필 이미지 정보 가져오기
    @GetMapping("ImageAndRating")
    public Map<String, Object> getImageAndRating(
            Member member,
            @RequestParam String memberId
    ) {
        return service.getImageAndRating(member, memberId);
    }

    // 후기 상태에 따라 가져오기
    @GetMapping("/review")
    public List<Review> getReviews(
            @RequestParam String memberId,
            @RequestParam String role
    ) {
        return service.getReviewsByStatus(memberId, role);
    }

    // 후기 작성하기
    @PostMapping("review/add")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> addReview(
            @RequestBody Review review) {
        System.out.println(review);
        if (service.validate(review)) {
            if (service.checkSeller(review.getSellerId())) {
                if (service.addReview(review)) {
                    return ResponseEntity.ok()
                            .body(Map.of("message", Map.of("type", "success",
                                            "text", STR."\{review.getProductName()} 상품에 대한 후기가 작성되었습니다."),
                                    "data", review));
                } else {
                    return ResponseEntity.internalServerError()
                            .body(Map.of("message", Map.of("type", "error",
                                    "text", "상품에 대한 후기 작성이 실패하였습니다.")));
                }
            } else {
                return ResponseEntity.internalServerError()
                        .body(Map.of("message", Map.of("type", "error",
                                "text", "이미 탈퇴한 회원입니다.")));
            }
        } else {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", Map.of("type", "error",
                            "text", "별점, 후기 내용이 입력되지 않았습니다.")));
        }
    }


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
    public List<Product> getLikes(@RequestParam String id) {
        return service.getLikes(id);
    }

    // 내 문의 내역 목록 가져오기
    @GetMapping("/list")
    @PreAuthorize("isAuthenticated()")
    public List<Inquiry> List(Authentication auth) {
        String memberId = auth.getName(); // 로그인한 사용자의 ID 가져오기
        return service.getInquiryByMemberId(memberId);
    }

    // 내 문의 내역에서 상세 문의 보기
    @GetMapping("view")
    @PreAuthorize("isAuthenticated()")
    public Inquiry view(@RequestParam int inquiryId, Authentication auth) {
        String memberId = auth.getName();
        return service.getview(memberId, inquiryId);
    }
}
