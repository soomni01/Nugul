package com.example.backend.controller.mypage;

import com.example.backend.dto.inquiry.Inquiry;
import com.example.backend.dto.member.Member;
import com.example.backend.dto.inquiry.InquiryComment;
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

    // 사용자 프로필 삭제하기
    @DeleteMapping("/image")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> deleteProfileImage(
            @RequestParam String memberId,
            @RequestParam String profileImage) {
        if (service.deleteProfileImage(memberId, profileImage)) {
            return ResponseEntity.ok()
                    .body(Map.of("message", Map.of("type", "success",
                            "text", "프로필 이미지가 삭제되었습니다.")));
        } else {
            return ResponseEntity.internalServerError()
                    .body(Map.of("message", Map.of("type", "error",
                            "text", "프로필 이미지 삭제가 실패하였습니다.")));
        }
    }

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

    // 특정 문의의 모든 댓글을 조회
    @GetMapping("/comments/{inquiryId}")
    public List<InquiryComment> getComments(@PathVariable int inquiryId) {
        return service.getCommentByInquiryId(inquiryId);
    }

    // 상세 문의 보기에서 수정
    @PutMapping("edit")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> editInquiry(@RequestBody Inquiry inquiry, Authentication auth) {
        if (service.hasAccess(inquiry.getInquiryId(), auth)) {
            if (service.validateInquiry(inquiry)) {
                if (service.editInquiry(inquiry)) {
                    return ResponseEntity.ok()
                            .body(Map.of("message", Map.of("type", "success",
                                    "text", inquiry.getInquiryId() + "번 문의글이 수정되었습니다.")));
                } else {
                    return ResponseEntity.internalServerError()
                            .body(Map.of("message", Map.of("type", "error",
                                    "text", inquiry.getInquiryId() + "번 문의글이 수정되지 않았습니다.")));
                }
            } else {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", Map.of("type", "warning",
                                "text", "제목이나 본문이 비어있을 수 없습니다.")));
            }
        } else {
            return ResponseEntity.status(403)
                    .body(Map.of("message", Map.of("type", "error",
                            "text", "수정 권한이 없습니다.")));
        }
    }

    // 상세 문의 보기에서 삭제
    @DeleteMapping("delete/{inquiryId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> deleteInquiry(@PathVariable int inquiryId, Authentication auth) {
        if (service.hasAccess(inquiryId, auth)) {
            if (service.deleteInquiry(inquiryId)) {
                return ResponseEntity.ok()
                        .body(Map.of("message", Map.of("type", "success",
                                "text", STR."\{inquiryId}번 문의글이 삭제되었습니다.")));
            } else {
                return ResponseEntity.internalServerError()
                        .body(Map.of("message", Map.of("type", "error",
                                "text", "문의글 삭제 중 문제가 발생하였습니다.")));
            }
        } else {
            return ResponseEntity.status(403)
                    .body(Map.of("message", Map.of("type", "error",
                            "text", "삭제 권한이 없습니다.")));
        }
    }

    // 월별 구매 내역 합계 가져오기
    @GetMapping("monthly-purchases")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Map<String, Object>>> getMonthlyPurchases(Authentication auth) {
        String memberId = auth.getName();
        List<Map<String, Object>> monthlyPurchases = service.getMonthlyPurchases(memberId);
        return ResponseEntity.ok(monthlyPurchases);
    }

    // 월별 판매 내역 합계 가져오기
    @GetMapping("monthly-sales")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Map<String, Object>>> getMonthlySales(Authentication auth) {
        String memberId = auth.getName();
        List<Map<String, Object>> monthlySales = service.getMonthlySales(memberId);
        return ResponseEntity.ok(monthlySales);
    }
}
